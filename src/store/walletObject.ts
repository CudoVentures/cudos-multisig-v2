import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface member {
    address: string;
    weight: string;
    metadata: string;
}[]

interface groupMetadata {
    walletName?: string
    generalInfo?: string
}

interface votingPeriod {
    seconds: number,
    nanos: number
}

export interface walletObjectState {
  admin?: string
  members?: member[]
  groupMetadata?: groupMetadata
  threshold?: string
  votingPeriod?: votingPeriod
  validContent?: boolean
}

export const initialState: walletObjectState = {
    admin: '',
    members: [],
    groupMetadata: {walletName: '', generalInfo: ''},
    threshold: '',
    votingPeriod: {seconds: 0, nanos: 0},
    validContent: false
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
