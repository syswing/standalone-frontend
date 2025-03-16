import { createSlice } from '@reduxjs/toolkit'

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: {},
  },
  reducers: {
    setTags: (state, action) => {
      const temp = {}
      const tagsList = action.payload
      for (let i = 0; i < tagsList.length; i++) {
        temp[`${tagsList[i].id}`] = tagsList[i]
      }
      state.tags = temp
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTags } = tagsSlice.actions

export default tagsSlice.reducer
