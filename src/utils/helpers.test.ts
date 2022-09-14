import { Coin } from 'cudosjs'

import { 
    ADMIN_BALANCES,
    EMPTY_BALANCES,
    INVALID_CUDOS_ADDRESS,
    REGULAR_BALANCES,
    VALID_CUDOS_ADDRESS} from '../utils/testEnvironments'

import { checkForAdminToken, formatAddress, getAccountBalances, getNativeBalance } from './helpers'

describe("Testing getAcountBalance", () => {
    const userAddress = VALID_CUDOS_ADDRESS()
    const invalidAddress = INVALID_CUDOS_ADDRESS()
    const expectedBalances: Coin[] = EMPTY_BALANCES()

    it('should pass and return empty balance', async () => {
        expect(await getAccountBalances(userAddress)).toEqual(expectedBalances)
    })

    it('should be chain rejected on query with wrong format address', async () => {
        try {
            await getAccountBalances(invalidAddress)
        } catch (error: any) {
            expect(error.message).toContain("invalid request");
        }
    })
})

describe("Testing checkForAdminToken", () => {

    it('should be TRUE if user have admin token', () => {
        expect(checkForAdminToken(ADMIN_BALANCES())).toEqual(true)
    })

    it('should be FALSE if user have NO admin token', () => {
        expect(checkForAdminToken(REGULAR_BALANCES())).toEqual(false)
    })

    it('should be FALSE if user have bo balance', () => {
        expect(checkForAdminToken(EMPTY_BALANCES())).toEqual(false)
    })
})

describe("Testing getNativeBalance", () => {

    it('should correctly extract the native balance if such', () => {
        expect(getNativeBalance(ADMIN_BALANCES())).toEqual('1234')
    })

    it('should correctly extract the native balance if such', () => {
        expect(getNativeBalance(REGULAR_BALANCES())).toEqual('1234')
    })

    it('should be 0 if user have no native balance', () => {
        expect(getNativeBalance(EMPTY_BALANCES())).toEqual('0')
    })
})

describe("Testing formatAddress", () => {

    const userAddress = VALID_CUDOS_ADDRESS()

    it('should correctly trim the given address', () => {
        expect(formatAddress(userAddress, 20).length).toBeLessThan(userAddress.length)
    })

    it('should change the given address', () => {
        expect(formatAddress(userAddress, 20)).not.toEqual(userAddress)
    })

    it('should add dots to the given address', () => {
        expect(formatAddress(userAddress, 20)).toContain('...')
    })

})
