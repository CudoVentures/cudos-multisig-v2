import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MenuState {
  menuSelection: string
}

const initialState: MenuState = {
    menuSelection: ''
}

export const menuSlice = createSlice({
  name: 'menuSelection',
  initialState,
  reducers: {
    updateMenuSelectionState: (state, action: PayloadAction<MenuState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateMenuSelectionState } = menuSlice.actions

export default menuSlice.reducer
