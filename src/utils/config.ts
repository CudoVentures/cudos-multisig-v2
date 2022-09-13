import { OfflineSigner, StargateClient } from "cudosjs";
import { SigningStargateClient } from "cudosjs";
import { getOfflineSigner as cosmostationSigner } from "@cosmostation/cosmos-client";
import { CHAIN_ID, COSMOSTATION_LEDGER, KEPLR_LEDGER, RPC_ADDRESS } from "./constants";
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

const getOfflineSignerByType = async (ledgerType: string): Promise<OfflineSigner | undefined> => {

    if (ledgerType === KEPLR_LEDGER) {
        return window.getOfflineSigner!(CHAIN_ID)
    }

    if (ledgerType === COSMOSTATION_LEDGER) {
        return cosmostationSigner(CHAIN_ID)
    }

    return undefined
}

export const getSigningClient = async (ledgerType: string): Promise<SigningStargateClient> => {

    const offlineSigner = await getOfflineSignerByType(ledgerType)

    if (window.keplr) {
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

const connectLedgerByType = async (ledgerType: string) => {

    if (ledgerType === KEPLR_LEDGER) {
        return connectKeplrLedger()
    }

    if (ledgerType === COSMOSTATION_LEDGER) {
        return connectCosmostationLedger()
    }

    return { address: '', accountName: '' }
}

export const getConnectedUserAddressAndName = async (ledgerType: string): Promise<{ address: string; accountName: string; }> => {

    const { address, accountName } = await connectLedgerByType(ledgerType)

    if (!isValidCudosAddress(address)) {
        throw new Error("Invalid ledger");
    }

    return { address: address, accountName: accountName }
}

export const connectUser = async (ledgerType: string): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(ledgerType)
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
        connectedLedger: ledgerType,
    }

    return connectedUser
}
