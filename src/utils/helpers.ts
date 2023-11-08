import moment from "moment"
import BigNumber from "bignumber.js"

import { queryClient } from "./config"
import { getCurrencyRate } from "api/calls"
import { emptyWallet, Wallet } from "store/user"
import { handleFullBalanceToPrecision, separateDecimals, separateFractions } from "./regexFormatting"
import { ADMIN_TOKEN_DENOM, CHAIN_ID, GAS_PRICE, NATIVE_TOKEN_DENOM } from "./constants"

import cudosLogo from 'assets/vectors/balances/cudos.svg'
import cudosAdminLogo from 'assets/vectors/balances/cudos-admin.svg'
import { votingPeriod } from "store/walletObject"
import { Coin, StdFee, StdSignature, SUPPORTED_WALLET } from "cudosjs"

export const formatDateTime = (dateTimeString: string): string => {
    const localTimeString: string = moment(dateTimeString).parseZone().toLocaleString()
    const formattedTime: string = moment(localTimeString)
        .format('DD MMM YYYY LTS')
        .toLocaleString()
    return formattedTime
}

export const displayWorthyFee = (fees: StdFee): string => {
    const feesAmount = fees.gas ? fees.amount[0].amount : '0'
    return handleFullBalanceToPrecision(feesAmount, 4, 'CUDOS')
}

export const amountToAcudos = (amount: number): string => {
    return (amount * 10 ** 18).toLocaleString('fullwide', { useGrouping: false })
}

export const convertVotingPeriodToSeconds = (selectedVotingPeriod: number): votingPeriod => {
    return {
        seconds: selectedVotingPeriod * 24 * 60 * 60,
        nanos: 0
    }
}

export const isThresholdDiscrepancy = (threshold: number, currentMembersCount: number): boolean => {
    return threshold > currentMembersCount
}

export const convertSecondsToDisplay = (seconds: number, desiredFormat: string): string => {
    let result: number = seconds
    switch (desiredFormat.toLowerCase()) {
        case 'seconds':
            break
        case 'minutes':
            result = Math.floor(result / 60)
            break
        case 'hours':
            result = Math.floor(result / 3600)
            break
        case 'days':
            result = Math.floor(result / (3600 * 24))
            break
        default:
            break
    }

    // This will cut the S if no plural form is needed as in this example: HOURS -> HOUR
    const format: string = result + 1 > 2 ? `${desiredFormat}` : `${desiredFormat.slice(0, -1)}`

    return `${result.toString()} ${format.toUpperCase()}`
}

export const calculateFeeFromGas = (gasAmount: number): string => {
    return new BigNumber(GAS_PRICE).multipliedBy(new BigNumber(gasAmount)).valueOf()
}

export const updatedWalletsBalances = async (wallets: Wallet[]): Promise<Wallet[]> => {

    const tempWallets: Wallet[] = []
    for await (const obj of wallets!) {
        const updatedWallet = await updateWalletBalances(obj)
        tempWallets.push(updatedWallet)
    }
    return tempWallets
}

export const updateWalletBalances = async (wallet: Wallet): Promise<Wallet> => {

    const tempWallet: Wallet = { ...wallet }
    const currentWalletBalances = await getAccountBalances(tempWallet.walletAddress)
    let isAdmin: boolean = false
    let nativeBalance: string = ''

    if (currentWalletBalances.length > 0) {
        isAdmin = checkForAdminToken(currentWalletBalances)
        nativeBalance = getNativeBalance(currentWalletBalances)
    }

    const updatedWallet: Wallet = {
        ...tempWallet,
        isAdmin: isAdmin,
        walletBalances: currentWalletBalances,
        nativeBalance: nativeBalance
    }

    return updatedWallet
}

export const findOneWallet = (wallets: Wallet[], givenAddress: string): Wallet => {

    let walletfound: Wallet = emptyWallet
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].walletAddress === givenAddress) {
            walletfound = { ...wallets[i] }
            break
        }
    }

    if (walletfound === emptyWallet) {
        console.error('Wallet not found')
    }
    return walletfound
}

// The wrapper function is merely for the purpose of escaping the double await later in code.
export const getAccountBalances = async (accountAddress: string): Promise<readonly Coin[]> => {
    return await (await queryClient).getAllBalances(accountAddress)
}

// This will take acudos and return the USD value
export const getCudosBalanceInUSD = async (balance: string, tokenRate?: string): Promise<string> => {
    let rate = '0'
    if (tokenRate) {
        rate = tokenRate
    } else {
        const fetchedRateFromCoinGecko = await getCurrencyRate('USD')
        rate = fetchedRateFromCoinGecko.data.cudos.usd
    }
    const rawResult: string = new BigNumber(balance).multipliedBy(rate).toString(10).replace(/\.[0-9]+/gm, "")
    const fullUsdBalance: string = separateDecimals(separateFractions(rawResult))
    return fullUsdBalance
}

export const checkForAdminToken = (balances: readonly Coin[]): boolean => {
    let isAdmin: boolean = false
    balances.map((balance) => {
        if (balance.denom === ADMIN_TOKEN_DENOM && parseInt(balance.amount) > 0) {
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

export const getNativeBalance = (balances: readonly Coin[]): string => {
    let nativeBalance = '0'
    balances.map((balance) => {
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

export const signArbitrary = async (
    walletType: SUPPORTED_WALLET,
    signingAddress: string,
    message: string
):
    Promise<{ signature: StdSignature }> => {
    let signature: StdSignature = {
        pub_key: { type: '', value: '' },
        signature: ""
    }
    if (walletType === SUPPORTED_WALLET.Keplr) {
        signature = await window.keplr!.signArbitrary(CHAIN_ID, signingAddress, message)
    }

    if (walletType === SUPPORTED_WALLET.Cosmostation) {
        signature = await window.cosmostation.providers.keplr.signArbitrary(CHAIN_ID, signingAddress, message)
    }
    return { signature }
}
