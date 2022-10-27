import { Coin } from 'cudosjs'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Member } from './walletObject'

export interface AddressBook {
  [key: string]: string;
}

export interface Wallet {
  walletAddress: string;
  members?: Member[];
  walletName?: string;
  generalInfo?: string;
  isAdmin?: boolean;
  proposals?: [];
  walletID?: number;
  executionPeriod?: number;
  threshold?: number;
  votingPeriod?: number;
  memberCount?: number;
  walletBalances?: readonly Coin[];
  nativeBalance?: string;
  chosenBalance?: Coin;
}

export interface userState {
  isAdmin?: boolean
  accountName?: string
  address?: string
  lastLoggedAddress?: string
  nativeBalance?: string
  balances?: readonly Coin[]
  wallets?: Wallet[]
  selectedWallet?: Wallet
  addressBook?: AddressBook
  chosenBalance?: Coin
  connectedLedger?: string
  newAddedAddress?: string
}

export const emptyWallet: Wallet = {
  walletAddress: '',
  members: [],
  walletName: '',
  generalInfo: '',
  isAdmin: false,
  proposals: [],
  walletID: 0,
  executionPeriod: 0,
  threshold: 0,
  votingPeriod: 0,
  memberCount: 0,
  walletBalances: [],
  nativeBalance: '',
  chosenBalance: { denom: '', amount: '' }
}

export const initialState: userState = {
  isAdmin: false,
  address: '',
  accountName: '',
  lastLoggedAddress: '',
  nativeBalance: '',
  balances: [],
  wallets: [],
  selectedWallet: emptyWallet,
  addressBook: {},
  chosenBalance: { denom: '', amount: '' },
  connectedLedger: '',
  newAddedAddress: ''
}

export const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<userState>) => {
      return { ...state, ...action.payload }
    },
    updateSelectedWallet: (state, action) => {
      state.selectedWallet = action.payload
      return state
    },
    updateUserWallets: (state, action) => {
      state.wallets = action.payload
      return state
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, updateSelectedWallet, updateUserWallets } = userStateSlice.actions

export default userStateSlice.reducer
