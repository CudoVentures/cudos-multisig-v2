import { cosmos, InstallError } from "@cosmostation/extension-client"

import {
  API_ADDRESS,
  CHAIN_ID,
  CHAIN_NAME,
  CURRENCY_DISPLAY_NAME,
  GAS_PRICE,
  NATIVE_TOKEN_DENOM
} from "utils/constants"

export const connectCosmostationLedger = async (): Promise<{ address: string; accountName: string; }> => {

  let userAccountAddress: string = ''
  let userAccountName: string = ''

  try {
    const provider = await cosmos()
    const activatedChains = await provider.getActivatedChainIds()

    if (!activatedChains.includes(CHAIN_ID.toLowerCase())) {
      await provider.addChain({
        chainId: CHAIN_ID,
        chainName: CHAIN_NAME,
        addressPrefix: CURRENCY_DISPLAY_NAME.toLowerCase(),
        baseDenom: NATIVE_TOKEN_DENOM,
        displayDenom: CURRENCY_DISPLAY_NAME,
        restURL: API_ADDRESS,
        decimals: 18,
        coinGeckoId: CURRENCY_DISPLAY_NAME.toLowerCase(),
        gasRate: {
          average: (Number(GAS_PRICE) * 2).toString(),
          low: (Number(GAS_PRICE) * 2).toString(),
          tiny: GAS_PRICE.toString(),
        }
      })
    }

     // Although the method suggests CHAIN_NAME as parameter only, it can work with CHAIN_ID too!
    const acccount = await provider.requestAccount(CHAIN_ID)
    userAccountAddress = acccount.address
    userAccountName = acccount.name

  } catch (error) {

    if (error instanceof InstallError) {
      throw new Error("Cosmostation extension not found")
    }

    if ((error as { code: number }).code === 4001) {
      throw new Error("user rejected request")
    }

  }

  return { address: userAccountAddress, accountName: userAccountName }
}
