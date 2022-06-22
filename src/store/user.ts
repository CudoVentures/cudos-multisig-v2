import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface addressBook {
  [key: string]: string;
}

export interface userState {
  isAdmin?: boolean
  address?: string
  lastLoggedAddress?: string
  nativeBalance?: string
  balances?: any[]
  wallets?: any[]
  addressBook?: addressBook
}

export const initialState: userState = {
  isAdmin: false,
  address: '',
  lastLoggedAddress: '',
  nativeBalance: '',
  balances: [],
  wallets: [],
  addressBook: {}
}

export const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<userState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser } = userStateSlice.actions

export default userStateSlice.reducer
