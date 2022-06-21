import BigNumber from "bignumber.js"
import { queryClient } from "./config"
import { ADMIN_TOKEN_DENOM, NATIVE_TOKEN_DENOM } from "./constants"

// The wrapper function is merely for the purpose of escaping the double await later in code.
export const getAccountBalances = async (accountAddress: string): Promise<any> => {
    return await (await queryClient).getAllBalances(accountAddress)
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