import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StepsState {
  currentStep: string
}

const initialState: StepsState = {
  currentStep: ''
}

export const stepsSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    updateSteps: (state, action: PayloadAction<StepsState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateSteps } = stepsSlice.actions

export default stepsSlice.reducer
