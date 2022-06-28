// ENV
export const RPC_ADDRESS = import.meta.env.VITE_APP_RPC || process.env.VITE_APP_RPC || ""
export const API_ADDRESS = import.meta.env.VITE_APP_API || process.env.VITE_APP_API || ""
export const EXPLORER_PUBLIC_ADDRESS = import.meta.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || process.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || ""
export const CHAIN_NAME = import.meta.env.VITE_APP_CHAIN_NAME || process.env.VITE_APP_CHAIN_NAME || ""
export const CHAIN_ID = import.meta.env.VITE_APP_CHAIN_ID || process.env.VITE_APP_CHAIN_ID || ""
export const GAS_PRICE = import.meta.env.VITE_APP_GAS_PRICE || process.env.VITE_APP_GAS_PRICE || ""

// General config
export const ADMIN_TOKEN_DENOM = 'cudosAdmin'
export const NATIVE_TOKEN_DENOM = 'acudos'
export const DEFAULT_META_DATA = 'default-metadata'
export const DEFAULT_MEMO = 'Created with CUDOS MultiSig'
export const DEFAULT_VOTING_WEIGHT = 1
export const DEFAULT_MULTIPLIER = 1.3

// Modal Msg Types
export const WALLET_CREATION_SUCCESS = 'Wallet Creation Success'
export const WALLET_CREATION_BECH32_FAILURE = 'Wrong Bech32 address'