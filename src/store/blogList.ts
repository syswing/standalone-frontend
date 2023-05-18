import { createSlice } from '@reduxjs/toolkit'

export const blogSlice = createSlice({
  name: 'blogList',
  initialState: {
    blogList: []
  },
  reducers: {
    setBlogList: (state, action) => {
			const dirData = action.payload
			// const reduceDir = (dirList) => {
			// 	if(dirList.length){
			// 		arrTemp = arrTemp.concat(dirList.childF)
			// 	} 
			// 	if(dirList.length){
			// 		for(let i = 0 ;i<dirList.length;i++){
			// 			reduceDir(dirList[i])
			// 		}
			// 	}
			// };
			// reduceDir(dirData)
      state.blogList = dirData
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBlogList } = blogSlice.actions

export default blogSlice.reducer
