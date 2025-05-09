import { useDispatch } from 'react-redux'
import action from '../request/action'
import { setTags } from '../store/tags'
import { setRoutes } from '../store/routes'
import { setBingPic } from '../store/bingPic'


export const fetchTags = async (dispatch) => {
  const tags = await action({
    path: '/tags/list',
  })
  dispatch(setTags(tags.data))
}

export const fetchRoutes = async (dispatch) => {
  const routes = await action({
    path: '/routes/list',
    params: {
      page:1,
      size:999
    },
  })
  dispatch(setRoutes(routes.data))
}

export const fetchBingPic = async (dispatch) => {
  const bingPic = await action({
    path: '/BingPic/bingPic',
  })
  dispatch(setBingPic(bingPic.data))
}

