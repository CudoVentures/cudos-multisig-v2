/// <reference types="vite/client" />
import '@mui/material/styles'
import { SxProps, Theme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      backgrounds: {
        light: string
        primary: string
        dark: string
      }
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      backgrounds?: {
        light?: string
        primary?: string
        dark?: string
      }
    }
  }
}

declare global {
  type Override<T1, T2> = Omit<T1, keyof T2> & T2

  type ComponentDefault = {
    className?: string
  }

  interface AvatarName {
    className?: string
    imageUrl?: string | null
    address: string
    name: string
    href?: (address: string) => string
  }

  type Transactions = {
    height: number
    hash: string
    success: boolean
    timestamp: string
    messages: {
      count: number
      items: any[]
    }
  }

  type TokenUnit = {
    displayDenom: string
    baseDenom: string
    exponent: number
    value: string
  }

  type DesmosProfile = {
    dtag: string
    nickname: string
    imageUrl: string
    coverUrl: string
    bio: string
    connections: ProfileConnectionType[]
    validator?: ValidatorProfile
  }

  type ProfileConnectionType = {
    network: string
    identifier: string
    creationTime: string
  }

  interface ImportMetaEnv {
    VITE_APP_CHAIN_ID: string
    VITE_APP_RPC: string
    VITE_APP_API: string
    VITE_APP_GAS_PRICE: number
    VITE_APP_CHAIN_NAME: string
    VITE_APP_EXPLORER_PUBLIC_ADDRESS: string
    VITE_APP_GAS_PRICE_DENOM: string
    VITE_APP_FEE_MULTIPLIER: number
  }

  interface SxMap {
    [className: string]: SxProps<Theme>
  }
}
