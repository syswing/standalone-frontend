import { createSlice } from '@reduxjs/toolkit'

export const blogSlice = createSlice({
  name: 'blogList',
  initialState: {
    blogList: []
  },
  reducers: {
    setBlogList: (state, action) => {
			const dirData = action.payload
			let arrTemp = []
			const reduceDir = (dirList) => {
				if(dirList.childF.length){
					arrTemp = arrTemp.concat(dirList.childF)
				}
				if(dirList.childD.length){
					for(let i = 0 ;i<dirList.childD.length;i++){
						reduceDir(dirList.childD[i])
					}
				}
			}
			reduceDir(dirData)
      state.blogList = arrTemp
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBlogList } = blogSlice.actions

export default blogSlice.reducer
