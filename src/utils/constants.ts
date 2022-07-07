// ENV
export const RPC_ADDRESS = import.meta.env.VITE_APP_RPC || process.env.VITE_APP_RPC || ""
export const API_ADDRESS = import.meta.env.VITE_APP_API || process.env.VITE_APP_API || ""
export const EXPLORER_PUBLIC_ADDRESS = import.meta.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || process.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || ""
export const CHAIN_NAME = import.meta.env.VITE_APP_CHAIN_NAME || process.env.VITE_APP_CHAIN_NAME || ""
export const CHAIN_ID = import.meta.env.VITE_APP_CHAIN_ID || process.env.VITE_APP_CHAIN_ID || ""
export const GAS_PRICE = import.meta.env.VITE_APP_GAS_PRICE || process.env.VITE_APP_GAS_PRICE || ""
export const GRAPHQL_URL = import.meta.env.VITE_APP_GRAPHQL_URL || process.env.VITE_APP_GRAPHQL_URL || ""
export const GRAPHQL_WS = import.meta.env.VITE_APP_GRAPHQL_WS || process.env.VITE_APP_GRAPHQL_WS || ""

// General config
export const ADMIN_TOKEN_DENOM = 'cudosAdmin'
export const NATIVE_TOKEN_DENOM = 'acudos'
export const DEFAULT_META_DATA = 'default-metadata'
export const DEFAULT_MEMO = 'Created with CUDOS MultiSig'
export const DEFAULT_VOTING_WEIGHT = 1
export const DEFAULT_MULTIPLIER = 1.3

// Modal Msg Titles
export const FILE_ERROR_TITLE = 'File Error'
export const LOGIN_FAIL_TITLE = 'Login Failed'
export const WALLET_PROCESS_FAIL_TITLE = 'Process Failed!'
export const WALLET_CREATION_FAILURE_TITLE = 'Creating Failed!'
export const WALLET_CREATION_LOADING_TITLE = 'Creating MultiSig Wallet...'
export const DUPLICATED_ADDRESS_EDITING_FAILUTE_TITLE = 'Address book operation failed'

// Modal Msg Types
export const WALLET_CREATION_SUCCESS_TYPE = 'Wallet Creation Success'
export const WALLET_CREATION_FAILURE_TYPE = 'Wallet Creation Failure'
export const WALLET_CORRUPTED_PROCESS_TYPE = 'Wallet Corrupted Process'
export const DUPLICATED_ADDRESS_TYPE = 'Duplicated address'

// General Modal Msgs
export const DEFAULT_LOGIN_FAILURE_MSG = 'Seems like something went wrong. Please try again later'
export const FILE_ERROR_MSG = 'File is in wrong format or contains invalid data'
export const WALLET_CREATION_FAILURE_MSG = 'Seems like something went wrong. Try again or check your account balance.'
export const WALLET_CREATION_SUCCESS_MSG = 'Your MultiSig account was successfully created!'
export const DEFAULT_LOADING_MODAL_MSG = 'Waiting for transaction confirmation...'
export const DUPLICATED_ADDRESS_MSG = "It seems the address already exists in your address book"