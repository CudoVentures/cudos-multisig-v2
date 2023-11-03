import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TokenRate {
  rate: string
}

const initialState: TokenRate = {
  rate: '0'
}

export const rateSlice = createSlice({
  name: 'tokenRate',
  initialState,
  reducers: {
    updateTokenRateState: (state, action: PayloadAction<TokenRate>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateTokenRateState } = rateSlice.actions

export default rateSlice.reducer
