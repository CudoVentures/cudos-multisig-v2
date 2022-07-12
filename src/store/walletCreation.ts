import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WalletCreationStepsState {
  currentStep: string
}

const initialState: WalletCreationStepsState = {
  currentStep: ''
}

export const WalletCreationStepsSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    updateWalletCreationSteps: (state, action: PayloadAction<WalletCreationStepsState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateWalletCreationSteps } = WalletCreationStepsSlice.actions

export default WalletCreationStepsSlice.reducer
