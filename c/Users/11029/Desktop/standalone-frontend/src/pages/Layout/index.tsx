
import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import { Box } from '@mui/system'
import { Card, Grid } from '@mui/material'
import styled from '@emotion/styled'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NavBar from './NavBar'
import { setBingPic } from '../../store/bingPic'
import action from '../../request/action'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, redirect, Outlet, useOutlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import MatchedLink from './MatchedLink'
import useWindowSize from 'hooks/useWindowSize'
import MarkdownToc from 'pages/Dashboard/Articles/MarkdownToc'
import MobileNavBar from '../../components/MobileNavBar'
import { fetchRoutes } from '../../hooks/useApi'

const BackgroundBar = ({ showTopBar }) => {
  const dispatch = useDispatch()
  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)

  useEffect(() => {
    const fetchBingPic = async () => {
      const result = await action({
        path: '/BingPic/bingPic',
      })
      dispatch(setBingPic(result.data))
    }
    fetchBingPic()
  }, [])

  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: -1,
          top: 0,
        }}
      ></div>
      {bingPic?.images?.length ? <TopBar drawSwitch={showTopBar} /> : null}
    </>
  )
}

const Layout = () => {
  const [showTopBar, setShowTopBar] = useState(false)
  const size = useWindowSize()
  const dispatch = useDispatch()
  const routes = useSelector((state: any) => state.routesReducer?.routes || [])

  useEffect(() => {
    fetchRoutes(dispatch)
  }, [dispatch])

  return (
    <Box
      style={{
        overflow: 'auto',
        width: '100%',
        height: '100vh',
        backgroundColor: '#ebebeb',
        display: 'flex',
      }}
    >
      {/* {size.width <= 600 && <MobileNavBar />} */}
      
      {/* 左侧白色背景区域 - 路由导航 */}
      <Box
        style={{
          width: '25%',
          height: '100vh',
          backgroundColor: '#ffffff',
          padding: '20px',
          overflowY: 'auto',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <NavBar routes={routes} />
      </Box>
      
      {/* 中间内容区域 */}
      <Box
        style={{
          width: '50%',
          height: '100vh',
          backgroundColor: '#ebebeb',
          position: 'relative',
          boxShadow: 'inset 15px 0 20px -10px rgba(0, 0, 0, 0.15), inset -15px 0 20px -10px rgba(0, 0, 0, 0.15)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          overflow: 'auto',
        }}
      >
        <Container
          maxWidth={'xl'}
          style={{
            width: '100%',
            minHeight: '100%',
          }}
        >
          <Grid
            className="pt-5"
            container
            spacing={1}
          >
            <Grid
              item
              xs={12}
            >
              <Card
                style={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none'
                }}
              >
                <Outlet />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* 右侧白色背景区域 */}
      <Box
        style={{
          width: '25%',
          height: '100vh',
          backgroundColor: '#ffffff',
          // boxShadow: 'inset 10px 0 20px rgba(0, 0, 0, 0.1)',
        }}
      />
      
      {/* <BackgroundBar showTopBar={showTopBar} /> */}
    </Box>
  )
}

export default Layout
