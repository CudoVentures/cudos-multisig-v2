import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface modalState {
    title?: string
    message?: string
    loading?: boolean
    success?: boolean
    failure?: boolean
    openAddressBook?: boolean
    addNewAddress?: boolean
    dataObject?: Object
}

export const initialState: modalState = {
    title: '',
    message: '',
    loading: false,
    success: false,
    failure: false,
    addNewAddress: false,
    openAddressBook: false,
    dataObject: {}
}

export const modalStateSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    updateModalState: (state, action: PayloadAction<modalState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateModalState } = modalStateSlice.actions

export default modalStateSlice.reducer
