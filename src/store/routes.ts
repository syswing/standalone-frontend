import { createSlice } from '@reduxjs/toolkit'

export const routesSlice = createSlice({
  name: 'routes',
  initialState: {
    routes: [],
  },
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload
    },
  },
})

export const { setRoutes } = routesSlice.actions

export default routesSlice.reducer
