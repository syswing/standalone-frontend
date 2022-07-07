import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'currentMusic',
  initialState: {
    currentMusic: {}
  },
  reducers: {
    setSongInfo: (state, action) => {
      state.currentMusic = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSongInfo } = counterSlice.actions

export default counterSlice.reducer
