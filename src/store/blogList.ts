import { createSlice } from '@reduxjs/toolkit'

export const blogSlice = createSlice({
  name: 'blogList',
  initialState: {
    blogList: []
  },
  reducers: {
    setBlogList: (state, action) => {
      state.blogList = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBlogList } = blogSlice.actions

export default blogSlice.reducer
