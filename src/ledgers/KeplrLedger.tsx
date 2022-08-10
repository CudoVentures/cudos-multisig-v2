/* eslint-disable import/prefer-default-export */

import { API_ADDRESS, CHAIN_ID, CHAIN_NAME, GAS_PRICE, RPC_ADDRESS } from "utils/constants";
import { Window as KeplrWindow } from "@keplr-wallet/types"

declare global {
    interface Window extends KeplrWindow { }
}

const config = {
    rpc: RPC_ADDRESS,
    rest: API_ADDRESS,
    chainName: CHAIN_NAME,
    chainId: CHAIN_ID,
    currencies: [
        {
            coinDenom: 'CUDOS',
            coinMinimalDenom: 'acudos',
            coinDecimals: 18,
            coinGeckoId: 'cudos'
        }
    ],
    stakeCurrency: {
        coinDenom: 'CUDOS',
        coinMinimalDenom: 'acudos',
        coinDecimals: 18,
        coinGeckoId: 'cudos'
    },
    feeCurrencies: [
        {
            coinDenom: 'CUDOS',
            coinMinimalDenom: 'acudos',
            coinDecimals: 18,
            coinGeckoId: 'cudos'
        }
    ],
    bip44: { coinType: 118 },
    bech32Config: {
        bech32PrefixAccAddr: 'cudos',
        bech32PrefixAccPub: 'cudospub',
        bech32PrefixValAddr: 'cudosvaloper',
        bech32PrefixValPub: 'cudosvaloperpub',
        bech32PrefixConsAddr: 'cudosvalcons',
        bech32PrefixConsPub: 'cudosvalconspub'
    },
    coinType: 118,
    gasPriceStep: {
        low: Number(GAS_PRICE),
        average: Number(GAS_PRICE) * 2,
        high: Number(GAS_PRICE) * 4
    }
}

export const connectLedger = async (): Promise<{ address: string; keplrName: string; }> => {
    if (!window.keplr) {
        throw new Error("Keplr extension not found")
    }

    window.keplr.defaultOptions = {
        sign: {
            preferNoSetFee: true,
        }
    }
    await window.keplr.experimentalSuggestChain(config)
    await window.keplr.enable(config.chainId)

    const key = await window.keplr.getKey(CHAIN_ID)
    return { address: key.bech32Address, keplrName: key.name }
}

export const getKeplrAddress = async (): Promise<string> => {
    const key = await window.keplr!.getKey(CHAIN_ID)
    return key.bech32Address;
}