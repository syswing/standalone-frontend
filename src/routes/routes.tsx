import React from 'react'
import Dashboard from '../pages/Dashboard'
import QQMusic from '../pages/QQMusic'
import Songlist from '../pages/QQMusic/Songlist'
import UserInfo from '../pages/QQMusic/userInfo'
import Info from '../pages/QQMusic/Info'
import Blog from '../pages/Dashboard/Blog'
import About from '../pages/Dashboard/About'
import BlogMd from '../pages/Dashboard/Blog/BlogMd'
import Sakura from '../pages/Dashboard/Sakura'
import BackEnd from '../pages/BackEnd'
import Study from '../pages/Dashboard/Study'
import Layout from '../pages/Layout'

const routes = [{
	path: "/",
	element: <Layout />,
	children: [{
		path:"blog",
		element:<Blog/>,
		children:[{
			path:':mdName',
			element:<BlogMd/>,
		}]
	},{
		path:"about",
		element:<About/>
	},{
		path:'player',
		element:<About/>
	},{
		path:'sakura',
		element:<Sakura/>
	},{
		path:'study',
		element:<Study/>
	}]
}, {
	path: "/qqmusic",
	element:<QQMusic/>
},{
	path:'/userinfo',
	element:<UserInfo/>,
	children:[{
		path:'/userinfo/songlist/:listId',
		element:<Songlist/>
	},{
		path:'/userinfo/info',
		element:<Info/>
	}]
}]

export default routes
