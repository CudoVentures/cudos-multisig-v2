import getAcountBalance from './getBalance'
import { 
    VALID_CUDOS_ADDRESS,
    INVALID_CUDOS_ADDRESS
} from '../utils/testEnvironments'

describe("Testing getAcountBalance", () => {
    const userAddress = VALID_CUDOS_ADDRESS()
    const invalidAddress = INVALID_CUDOS_ADDRESS()
    const expectedBalance: any[] = []

    it('should pass and return empty balance', async () => {
        const { balances } = await getAcountBalance(userAddress)
        expect(balances).toEqual(expectedBalance)
    })

    it('should be chain rejected on query with wrong format address', async () => {
        try {
            await getAcountBalance(invalidAddress)
        } catch (e: any) {
            expect(e.message).toBe("Request failed with status code 500");
        }
    })
})
