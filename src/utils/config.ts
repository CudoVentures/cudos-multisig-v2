import { StargateClient } from "cudosjs";
import { SigningStargateClient } from "cudosjs";
import { CHAIN_ID, RPC_ADDRESS } from "./constants";

export const queryClient = (async (): Promise<StargateClient> => {
    const client = await StargateClient.connect(RPC_ADDRESS)
    return client
  })()

export const signingClient = (async (): Promise<SigningStargateClient> => {
  const offlineSigner = await window.getOfflineSigner(CHAIN_ID)
  const client = await SigningStargateClient.connectWithSigner(RPC_ADDRESS, offlineSigner)
  return client
})()
