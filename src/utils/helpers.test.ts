import { 
    VALID_CUDOS_ADDRESS,
    INVALID_CUDOS_ADDRESS
} from '../utils/testEnvironments'
import { getAccountBalances } from './helpers'

describe("Testing getAcountBalance", () => {
    const userAddress = VALID_CUDOS_ADDRESS()
    const invalidAddress = INVALID_CUDOS_ADDRESS()
    const expectedBalance: any[] = []

    it('should pass and return empty balance', async () => {
        expect(await getAccountBalances(userAddress)).toEqual(expectedBalance)
    })

    it('should be chain rejected on query with wrong format address', async () => {
        try {
            await getAccountBalances(invalidAddress)
        } catch (e: any) {
            expect(e.message).toContain("invalid request");
        }
    })
})
