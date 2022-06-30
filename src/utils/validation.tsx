import { bech32 } from "bech32";

export const isValidCudosAddress = (addr: string) => {
    if (addr === '' || addr === undefined) return false
    // const addressCheck = addr.replace(/^cudos[0-9a-z]{39}$/gm, 'OK');
    try {
        const { prefix: decodedPrefix } = bech32.decode(addr)
        return decodedPrefix === "cudos"

      } catch {
        // invalid checksum
        return false
      }
}

// Handling whole numbers at the moment
export const isValidAmount = (amount: string) => {
    if (amount === '' || amount === undefined) return false
    const amountCheck = amount.replace(/^[1-9]{1}[0-9]*$/gm, 'OK')
    return amountCheck === 'OK'
}
