import { isExtensionEnabled, OfflineSigner, StargateClient, SUPPORTED_WALLET } from "cudosjs";
import { SigningStargateClient } from "cudosjs";
import { getOfflineSigner as cosmostationSigner } from "@cosmostation/cosmos-client";
import { CHAIN_ID, RPC_ADDRESS } from "./constants";
import { userState } from "store/user";
import { connectKeplrLedger } from "ledgers/KeplrLedger";
import { connectCosmostationLedger } from "ledgers/CosmostationLedger";
import { Firebase } from "./firebase";
import { checkForAdminToken, getAccountBalances, getNativeBalance } from "./helpers";
import { isValidCudosAddress } from "./validation";

export const queryClient = (async (): Promise<StargateClient> => {
    const client = await StargateClient.connect(RPC_ADDRESS)
    return client
})()

const getOfflineSignerByType = async (walletName: SUPPORTED_WALLET): Promise<OfflineSigner | undefined> => {

    if (walletName === SUPPORTED_WALLET.Keplr) {
        return window.getOfflineSigner!(CHAIN_ID)
    }

    if (walletName === SUPPORTED_WALLET.Cosmostation) {
        return cosmostationSigner(CHAIN_ID)
    }

    return undefined
}

export const getSigningClient = async (walletName: SUPPORTED_WALLET): Promise<SigningStargateClient> => {

    const offlineSigner = await getOfflineSignerByType(walletName)

    if (isExtensionEnabled(walletName)) {
        window.keplr.defaultOptions = {
            sign: {
                preferNoSetFee: true,
            },
        }
    }

    if (!offlineSigner) {
        throw new Error("Invalid signing client");
    }

    return SigningStargateClient.connectWithSigner(RPC_ADDRESS, offlineSigner)
}

const connectLedgerByType = async (walletName: SUPPORTED_WALLET) => {

    if (walletName === SUPPORTED_WALLET.Keplr) {
        return connectKeplrLedger()
    }

    if (walletName === SUPPORTED_WALLET.Cosmostation) {
        return connectCosmostationLedger()
    }

    return { address: '', accountName: '' }
}

export const getConnectedUserAddressAndName = async (walletName: SUPPORTED_WALLET): Promise<{ address: string; accountName: string; }> => {

    const { address, accountName } = await connectLedgerByType(walletName)

    if (!isValidCudosAddress(address)) {
        throw new Error("Invalid ledger");
    }

    return { address: address, accountName: accountName }
}

export const connectUser = async (walletName: SUPPORTED_WALLET): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(walletName)
    const currentBalances = await getAccountBalances(address)
    const admin = checkForAdminToken(currentBalances)
    const userBalance = getNativeBalance(currentBalances)
    const addressBook = await Firebase.getAddressBook(address)

    const connectedUser: userState = {
        accountName: accountName,
        address: address,
        lastLoggedAddress: address,
        balances: currentBalances,
        nativeBalance: userBalance,
        isAdmin: admin,
        addressBook: addressBook,
        connectedLedger: walletName,
    }

    return connectedUser
}
