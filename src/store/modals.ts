import { createSlice } from '@reduxjs/toolkit'

export interface modalState {
    title: string
    message: string
    loading: boolean
    success: boolean
    failure: boolean
    dataObject?: Object
}

const initialState: modalState = {
    title: '',
    message: '',
    loading: false,
    success: false,
    failure: false,
    dataObject: {}
}

export const modalStateSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    updateModalState: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateModalState } = modalStateSlice.actions

export default modalStateSlice.reducer