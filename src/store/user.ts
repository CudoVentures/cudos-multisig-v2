import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Coin } from 'cudosjs'
import { member } from './walletObject'

interface addressBook {
  [key: string]: string;
}

export interface wallet {
  walletName?: string;
  isAdmin?: boolean;
  walletAddress?: string;
  walletID?: string;
  members?: member[];
  memberCount?: number;
  threshold?: number;
  walletBalances?: Coin[];
  nativeBalance: string;
}

export interface userState {
  isAdmin?: boolean
  address?: string
  lastLoggedAddress?: string
  nativeBalance?: string
  balances?: Coin[]
  wallets?: wallet[]
  selectedWallet?: wallet
  addressBook?: addressBook
}

export const emptyWallet: wallet = {  
  walletName: '',
  walletAddress: '',
  walletID: '',
  isAdmin: false,
  members: [],
  memberCount: 0,
  threshold: 0,
  walletBalances: [],
  nativeBalance: ''
}

export const initialState: userState = {
  isAdmin: false,
  address: '',
  lastLoggedAddress: '',
  nativeBalance: '',
  balances: [],
  wallets: [],
  selectedWallet: emptyWallet
}

export const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<userState>) => {
      return { ...state, ...action.payload }
    },
    updatedSelectedWallet: (state, action) => {
      state.selectedWallet = action.payload
      return state
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, updatedSelectedWallet } = userStateSlice.actions

export default userStateSlice.reducer
