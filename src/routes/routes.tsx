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
import Articles from '../pages/Dashboard/Articles'
import ArticleContent from '../pages/Dashboard/Articles/ArticleContent'
import ManagementLayout from '../pages/ManagementLayout'
import WriteMd from '../pages/ManagementLayout/WriteMd'
import MdList from '../pages/ManagementLayout/MdList'
import Tags from '../pages/ManagementLayout/Tags'
import Pic from '../pages/ManagementLayout/Pic'
import Resume from '../pages/Resume'

export const managementMenu = [
	{
		path:"/management/MdList",
		title:'日志管理',
    element:<MdList/>
	},{
		path:"/management/tags",
		title:'标签管理',
    element:<Tags/>
	},{
		path:"/management/pic",
		title:'图片管理',
    element:<Pic/>
	}
]

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
		path:"articles",
		element:<Articles/>,
		children:[{
			path:':articleName',
			element:<ArticleContent/>,
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
},{
	path:"/management",
	element:<ManagementLayout/>,
	children:[{
    path:"/management/writeMd",
		title:'写日志',
    element:<WriteMd/>
  }].concat(managementMenu)
},{
	path:"/resume",
	element:<Resume/>,
}]



export default routes
