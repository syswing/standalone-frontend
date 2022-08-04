import { configureStore } from '@reduxjs/toolkit'
import currentMusicReducer from './currentMusic'
import blogListReducer from './blogList'
import currentBlogReducer from './currentBlog'
export default configureStore({
  reducer: {
		currentMusicReducer,
		blogListReducer,
		currentBlogReducer
	}
})
