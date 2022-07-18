import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface modalState {
    title?: string
    message?: string
    msgType?: string
    loading?: boolean
    loadingType?: boolean
    success?: boolean
    failure?: boolean
    openAddressBook?: boolean
    openAssetsTable?: boolean
    transactionSelector?: boolean
    walletRelated?: boolean
    openFundWallet?: boolean
    addNewAddress?: boolean
    editAddressBookRecord?: boolean
    dataObject?: Object
}

export const initialState: modalState = {
    title: '',
    message: '',
    msgType: '',
    loading: false,
    success: false,
    loadingType: false,
    failure: false,
    addNewAddress: false,
    editAddressBookRecord: false,
    transactionSelector: false,
    walletRelated: false,
    openAddressBook: false,
    openFundWallet: false,
    openAssetsTable: false,
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
