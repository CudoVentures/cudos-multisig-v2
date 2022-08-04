import { StargateClient } from "cudosjs";
import { SigningStargateClient } from "cudosjs";
import { CHAIN_ID, RPC_ADDRESS } from "./constants";

export const queryClient = (async (): Promise<StargateClient> => {
    const client = await StargateClient.connect(RPC_ADDRESS)
    return client
})()

export const getSigningClient = (): Promise<SigningStargateClient> => {
    const offlineSigner = window.getOfflineSigner!(CHAIN_ID)
    return SigningStargateClient.connectWithSigner(RPC_ADDRESS, offlineSigner)
}
