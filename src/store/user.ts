import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface userState {
  isAdmin: boolean
  address: string
  nativeBalance: string
  balances: any[]
  wallets: any[]
}

const initialState: userState = {
  isAdmin: false,
  address: '',
  nativeBalance: '',
  balances: [],
  wallets: []
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
