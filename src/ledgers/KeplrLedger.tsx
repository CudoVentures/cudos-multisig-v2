import { 
    API_ADDRESS, 
    CHAIN_ID, 
    CHAIN_NAME, 
    GAS_PRICE, 
    RPC_ADDRESS, 
    STAKING_URL 
} from "utils/constants"
import { Window as KeplrWindow } from "@keplr-wallet/types"
import { KeplrWallet } from 'cudosjs'

declare global {
    interface Window extends KeplrWindow { }
}

export const connectKeplrLedger = async (): Promise<{ address: string; accountName: string; }> => {
    if (!window.keplr) {
        throw new Error("Keplr extension not found")
    }

    const wallet = new KeplrWallet({
        CHAIN_ID: CHAIN_ID,
        CHAIN_NAME: CHAIN_NAME,
        RPC: RPC_ADDRESS,
        API: API_ADDRESS,
        STAKING: STAKING_URL,
        GAS_PRICE: GAS_PRICE.toString()
    })

    await wallet.connect()

    const key = await window.keplr.getKey(CHAIN_ID)
    return { address: key.bech32Address, accountName: key.name }
}

export const getKeplrAddress = async (): Promise<string> => {
    const key = await window.keplr!.getKey(CHAIN_ID)
    return key.bech32Address;
}