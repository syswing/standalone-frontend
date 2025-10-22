import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import { Box } from '@mui/system'
import { Card, Fab, Grid, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NavBar from './NavBar'
import { setBingPic } from '../../store/bingPic'
import action from '../../request/action'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, redirect, Outlet, useOutlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import MatchedLink from './MatchedLink'
import MobileNavBar from '../../components/MobileNavBar'
import { fetchRoutes } from '../../hooks/useApi'
import KeyboardTab from '@mui/icons-material/KeyboardTab'
import useWindowSize from 'hooks/useWindowSize'
import MarkdownToc from 'pages/Dashboard/Articles/MarkdownToc'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
  const [isMiddleCollapsed, setIsMiddleCollapsed] = useState(false) // 新增状态
  const size = useWindowSize()
  const dispatch = useDispatch()

  const routes = useSelector((state: any) => state.routesReducer?.routes || [])
  const currentBlog = useSelector((state: any) => state.currentBlogReducer.currentBlog)
  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)
  const bingUrl = useSelector((state: any) => state.bingPicSliceReducer.bingUrl)
  const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)

  console.log('routes', routes)

  useEffect(() => {
    fetchRoutes(dispatch)
  }, [dispatch])

  // 获取背景图片URL
  const backgroundImageUrl = bingPic?.images?.[currentPic]?.url ? `${bingUrl}${bingPic.images[currentPic].url}` : ''

  // 计算宽度
  const getWidths = () => {
    if (size.width <= 600) {
      return { left: '0%', middle: '100%', right: '0%' }
    }

    if (isMiddleCollapsed) {
      return { left: '0%', middle: '0%', right: '100%' } // 折叠时隐藏左侧，右侧占满
    }

    return { left: '25%', middle: '50%', right: '25%' }
  }

  const widths = getWidths()

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
      {/* 左侧区域 - 折叠时隐藏 */}
      {size.width > 600 && !isMiddleCollapsed && (
        <Box
          style={{
            width: widths.left,
            height: '100vh',
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
            backgroundSize: '800%',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
            transition:
              'width 0.3s ease-in-out, background-size 0.3s ease-in-out, background-position 0.3s ease-in-out',
          }}
        >
          {/* 添加半透明遮罩层 */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(2px)',
              transition: 'background-color 0.3s ease-in-out',
            }}
          />
          <Box
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '20px',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            <NavBar routes={routes} />
          </Box>
        </Box>
      )}

      {/* 中间内容区域 */}
      <Box
        style={{
          width: widths.middle,
          height: '100vh',
          backgroundColor: '#ebebeb',
          position: 'relative',
          boxShadow:
            widths.middle !== '0%'
              ? 'inset 15px 0 20px -10px rgba(0, 0, 0, 0.15), inset -15px 0 20px -10px rgba(0, 0, 0, 0.15)'
              : 'none',
          borderLeft: widths.middle !== '0%' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          borderRight: widths.middle !== '0%' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          overflow: 'auto',
          transition: 'width 0.3s ease-in-out',
          opacity: widths.middle === '0%' ? 0 : 1,
          visibility: widths.middle === '0%' ? 'hidden' : 'visible',
        }}
      >
        {widths.middle !== '0%' && (
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
                    boxShadow: 'none',
                  }}
                >
                  <Outlet />
                </Card>
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>

      {/* 右侧区域 */}
      {size.width > 600 && (
        <Box
          style={{
            width: widths.right,
            height: '100vh',
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
            backgroundSize: isMiddleCollapsed ? 'cover' : '800%', // 折叠时显示完整图片
            backgroundPosition: isMiddleCollapsed ? 'center' : 'right center', // 折叠时居中显示
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            borderLeft: !isMiddleCollapsed ? '1px solid rgba(0, 0, 0, 0.1)' : 'none', // 折叠时去掉左边框
            transition:
              'width 0.3s ease-in-out, background-size 0.3s ease-in-out, background-position 0.3s ease-in-out',
          }}
        >
          {/* 添加半透明遮罩层 */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isMiddleCollapsed ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.85)', // 折叠时使用深色遮罩
              backdropFilter: isMiddleCollapsed ? 'none' : 'blur(2px)',
              transition: 'background-color 0.3s ease-in-out',
            }}
          />
          <Box
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '20px',
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 折叠时显示图片信息和导航 */}
            {isMiddleCollapsed && (
              <>
                {/* 导航菜单 */}

                {/* <Box style={{ marginBottom: '20px' }}>
                  <NavBar routes={routes} />
                </Box> */}

                {/* 图片信息 */}
                {bingPic?.images?.[currentPic] && (
                  <Box
                    style={{
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                      marginBottom: '20px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{ marginBottom: '10px' }}
                    >
                      {bingPic.images[currentPic].title}
                    </Typography>
                    <Typography variant="body2">{bingPic.images[currentPic].copyright}</Typography>
                    <Typography variant="body2">图片素材来自于@bing</Typography>
                  </Box>
                )}
              </>
            )}
            {!isMiddleCollapsed && currentBlog.tocContent && (
              <Grid
                item
                xs="auto"
              >
                <MarkdownToc />
              </Grid>
            )}
          </Box>
          <Fab
            color="primary"
            aria-label="keyboard-tab"
            onClick={() => {
              setIsMiddleCollapsed(!isMiddleCollapsed)
            }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 2,
              transform: isMiddleCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <KeyboardTab />
          </Fab>
        </Box>
      )}

      {/* <BackgroundBar showTopBar={showTopBar} /> */}
    </Box>
  )
}

export default Layout
