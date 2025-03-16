import { configureStore } from '@reduxjs/toolkit'
import currentMusicReducer from './currentMusic'
import blogListReducer from './blogList'
import currentBlogReducer from './currentBlog'
import tagsReducer from './tags'
import bingPicSliceReducer from './bingPic'
import routesReducer from './routes'

export default configureStore({
  reducer: {
    currentMusicReducer,
    blogListReducer,
    currentBlogReducer,
    tagsReducer,
    bingPicSliceReducer,
    routesReducer,
  },
})
