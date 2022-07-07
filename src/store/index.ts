import { configureStore } from '@reduxjs/toolkit'
import currentMusicReducer from './currentMusic'

export default configureStore({
  reducer: {
		currentMusicReducer
	}
})
