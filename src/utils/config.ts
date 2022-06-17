import { StargateClient } from "cudosjs";

export const queryClient = (async (): Promise<StargateClient> => {
    const client = await StargateClient.connect(import.meta.env.VITE_APP_RPC)
    return client
  })()
