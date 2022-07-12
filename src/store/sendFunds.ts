import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { multisendRow } from 'utils/multiSendTableHelper'

export interface sendFundsState {
  currentStep?: string
  multisendRows?: multisendRow[]
}

export const initialState: sendFundsState = {
  currentStep: '',
  multisendRows: []
}

export const SendFundsSlice = createSlice({
  name: 'sendFunds',
  initialState,
  reducers: {
    updateSendFunds: (state, action: PayloadAction<sendFundsState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateSendFunds } = SendFundsSlice.actions

export default SendFundsSlice.reducer