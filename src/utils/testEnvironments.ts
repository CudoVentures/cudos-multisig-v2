
import { bech32 } from 'bech32'
import { Coin } from 'cudosjs'
import { randomBytes, randomInt } from 'node:crypto'

const wordsOne: Buffer = randomBytes(20)
const words: number[] = bech32.toWords(wordsOne)

export const VALID_CUDOS_ADDRESS = (): string => bech32.encode("cudos", words)
export const INVALID_CUDOS_ADDRESS = (): string => bech32.encode("invalid", words)
export const RANDOM_CUDOS_AMOUNT = (): string =>  `${randomInt(100).toString()}acudos`
export const EMPTY_BALANCES = (): [] => []
export const REGULAR_BALANCES = (): Coin[] => [{denom: "acudos", amount: "1234"}]
export const ADMIN_BALANCES = (): Coin[] => [{denom: "cudosAdmin", amount: "1"}, {denom: "acudos", amount: "1234"}]
