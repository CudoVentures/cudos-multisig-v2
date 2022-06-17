import { queryClient } from "./config"

// The wrapper function is merely for the purpose of escaping the double await later in code.
export const getAccountBalances = async (accountAddress: string): Promise<any> => {
    return await (await queryClient).getAllBalances(accountAddress)
}
