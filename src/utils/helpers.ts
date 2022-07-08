import { getCurrencyRate } from "api/calls"
import BigNumber from "bignumber.js"
import { emptyWallet, wallet } from "store/user"
import { queryClient } from "./config"
import { ADMIN_TOKEN_DENOM, GAS_PRICE, NATIVE_TOKEN_DENOM } from "./constants"
import { separateDecimals, separateFractions } from "./regexFormatting"
import cudosLogo from 'assets/vectors/balances/cudos.svg'
import cudosAdminLogo from 'assets/vectors/balances/cudos-admin.svg'

export const enforceCustomFeesOverKeplr = () => {
    return window.keplr.defaultOptions = {
        sign: {
            preferNoSetFee: true,
        }
      }
}

export const calculateFeeFromGas = (gasAmount: number): string => {
    return new BigNumber(GAS_PRICE).multipliedBy(new BigNumber(gasAmount)).valueOf()
}

export const findOneWallet = (wallets: wallet[], givenAddress: string): wallet | undefined => {
    let walletfound: wallet = emptyWallet

    try {
        Object.entries(wallets!).forEach(([idx, currentWallet]) => {
            if (currentWallet.walletAddress === givenAddress) {
                walletfound = {...currentWallet}
            }
        })

        if (walletfound.walletAddress) {
            return walletfound

        } else {
            throw new Error('Wallet not found')
        }

    } catch (e: any) {
        console.debug(e.message)
    }
}

// The wrapper function is merely for the purpose of escaping the double await later in code.
export const getAccountBalances = async (accountAddress: string): Promise<any> => {
    return await (await queryClient).getAllBalances(accountAddress)
}

// This will take acudos and return the USD value
export const getCudosBalanceInUSD = async (balance: string): Promise<string> => {
    const response = await getCurrencyRate('USD')
    const rate = response.data.cudos.usd
    const rawResult = new BigNumber(balance).multipliedBy(rate).toString(10).replace(/\.[0-9]+/gm, "")
    const fullUsdBalance = separateDecimals(separateFractions(rawResult))
    return fullUsdBalance
}

export const getAccountWallets = async (accountAddress: string): Promise<any> => {
    return []
    // Waiting for a CUDOS JS method for returning all wallets 
    // associated with an address on the Query Client
}

export const checkForAdminToken = (balances: any[]): boolean => {
    let isAdmin = false
    balances.map((balance) => {
        if ( balance.denom === ADMIN_TOKEN_DENOM && parseInt(balance.amount) > 0) { 
            isAdmin = true 
        }
    })
    return isAdmin
}

export const formatAddress = (text: string, sliceIndex: number): string => {
    if (!text) { return '' }
    const len = text.length
    if (text === null || text.length < 10) { 
        return text 
    }
    return `${text.slice(0, sliceIndex)}...${text.slice(len - 4, len)}`
  }

export const getNativeBalance = (balances: any[]): string => {
    let nativeBalance: string = '0'
    balances.map((balance: any) => {
      if (balance.denom === NATIVE_TOKEN_DENOM && new BigNumber(balance.amount).gt(0)) {
        nativeBalance = balance.amount
      }
    })
    return nativeBalance
}

export const denomToIcon = {
    'acudos': cudosLogo,
    'cudos': cudosLogo,
    'cudosAdmin': cudosAdminLogo
}

export const denomToAlias = {
    'acudos': "CUDOS",
    'cudosAdmin': 'ADMIN TOKENS'
}
