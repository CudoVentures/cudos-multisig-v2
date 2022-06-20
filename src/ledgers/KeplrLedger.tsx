/* eslint-disable import/prefer-default-export */

import { API_ADDRESS, CHAIN_ID, CHAIN_NAME, GAS_PRICE, RPC_ADDRESS } from "utils/constants";

declare global {
    interface Window {
      keplr: any
      getOfflineSigner: any
      getOfflineSignerOnlyAmino: any
      meta: any
    }
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

export const ConnectLedger = async () => {
    window.keplr.defaultOptions = {
        sign: {
            preferNoSetFee: true,
        }
    }
    await window.keplr.experimentalSuggestChain(config)
    await window.keplr.enable(config.chainId)
  
    const offlineSigner = await window.getOfflineSigner(config.chainId)
    const accounts = await offlineSigner.getAccounts()
  
    const { address } = accounts[0]
  
    return { address }
  }
