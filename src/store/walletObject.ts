import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StdFee } from 'cudosjs'

export interface member {
    address: string;
    weight?: number;
    metadata?: string;
}

interface groupMetadata {
    walletName?: string
    generalInfo?: string
}

export interface votingPeriod {
    seconds: number,
    nanos: number
}

export interface walletObjectState {
  admin?: string
  members?: member[]
  groupMetadata?: groupMetadata
  threshold?: number
  votingPeriod?: votingPeriod
  validContent?: boolean
  feeForCreation?: StdFee
}

export const initialState: walletObjectState = {
    admin: '',
    members: [],
    groupMetadata: {walletName: '', generalInfo: ''},
    threshold: 0,
    votingPeriod: {seconds: 0, nanos: 0},
    validContent: false,
    feeForCreation: {amount: [], gas: '0'}
}

export const walletObjectStateSlice = createSlice({
  name: 'walletObjectState',
  initialState,
  reducers: {
    updateWalletObjectState: (state, action: PayloadAction<walletObjectState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateWalletObjectState } = walletObjectStateSlice.actions

export default walletObjectStateSlice.reducer
