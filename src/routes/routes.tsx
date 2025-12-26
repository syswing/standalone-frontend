import React from 'react'
import { Navigate } from 'react-router-dom'
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
import Components from '../pages/Components'
import Routes from '../pages/ManagementLayout/Routes'
import Ocr from '../pages/ManagementLayout/Ocr'
import Comments from 'pages/ManagementLayout/Comments'
import DeepseekChat from 'components/DeepseekChat'
import Login from 'pages/Login'
import DstServer from 'pages/dstServer/dstServer'
import Player from 'pages/ManagementLayout/Player'
  
export const managementMenu = [
  {
    path: '/management/MdList',
    title: '日志管理',
    element: <MdList />,
  },
  {
    path: '/management/tags',
    title: '标签管理',
    element: <Tags />,
  },
  {
    path: '/management/pic',
    title: '图片管理',
    element: <Pic />,
  },
  {
    path: '/management/routes',
    title: '路由管理',
    element: <Routes />,
  },
  {
    path: '/management/comments',
    title: '评论管理',
    element: <Comments />,
  },
  {
    path: '/management/ocr',
    title: 'ocr',
    element: <Ocr />,
  },
  {
    path: '/management/deepseek',
    title: 'deepseek',
    element: <DeepseekChat />,
  },
  {
    path:"/management/components",
    title: '组件管理',
    element: <Components />,
  },
  {
    path: '/management/player',
    title: '播放器',
    element: <Player />,
  }
]

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, // 添加 index 路由
        element: <Navigate to="/articles" replace />, // 重定向到 /articles
      },
      {
        path:'dst',
        children:[
          {
            path:'server',
            element: <DstServer />,
          }
        ]
      },
      {
        path: 'blog',
        element: <Blog />,
        children: [
          {
            path: ':mdName',
            element: <BlogMd />,
          },
        ],
      },
      {
        path: 'articles',
        element: <Articles />,
        children: [
          {
            path: ':articleName',
            element: <ArticleContent />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'player',
        element: <About />,
      },
      {
        path: 'study',
        element: <Study />,
      },
      {
        path: 'qqmusic',
        element: <QQMusic />,
      },
      {
        path: 'userinfo',
        element: <UserInfo />,
        children: [
          {
            path: '/userinfo/songlist/:listId',
            element: <Songlist />,
          },
          {
            path: '/userinfo/info',
            element: <Info />,
          },
        ],
      },
    ],
  },
  {
    path: '/management',
    element: <ManagementLayout />,
    children: [
      {
        path: '/management/writeMd',
        title: '写日志',
        element: <WriteMd />,
      },
    ].concat(managementMenu as any),
  },
  {
    path: '/resume',
    element: <Resume />,
  },
  {
    path: '/components',
    element: <Components />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]

export default routes
