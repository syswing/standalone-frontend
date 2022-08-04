import { createSlice } from '@reduxjs/toolkit'

export const blogMdSlice = createSlice({
  name: 'currentBlog',
  initialState: {
    currentBlog: {}
  },
  reducers: {
    setBlogMd: (state, action) => {
      state.currentBlog = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBlogMd } = blogMdSlice.actions

export default blogMdSlice.reducer