import { createSlice } from '@reduxjs/toolkit'

export const bingPicSlice = createSlice({
  name: 'bingPic',
  initialState: {
		bingUrl:'https://cn.bing.com',
    bingPic: {
      images:[] as any
    },
		current:0,
		last:0,
  },
  reducers: {
    setBingPic: (state, action) => {
      state.bingPic = action.payload,
			state.last = state.bingPic.images.length
    },
    nextPic:(state, action) => {
      if(state.current < state.last - 1){
        state.current++
      }
    },
    frontPic:(state, action) => {
      if(state.current > 0){
        state.current--
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBingPic,nextPic,frontPic } = bingPicSlice.actions

export default bingPicSlice.reducer
