import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FIRST_STEP } from 'components/WalletCreationSteps'

export interface WalletCreationState {
  currentStep: number
}

export const initialState: WalletCreationState = {
  currentStep: FIRST_STEP
}

export const WalletCreationSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    updateWalletCreationState: (state, action: PayloadAction<WalletCreationState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateWalletCreationState } = WalletCreationSlice.actions

export default WalletCreationSlice.reducer
