import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import { Box } from '@mui/system'
import { Card, Fab, Grid, Typography, Drawer, IconButton } from '@mui/material'
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MusicPlayer from 'components/MusicPlayer'
import MenuIcon from '@mui/icons-material/Menu'
import TocIcon from '@mui/icons-material/Toc'
import { PlayArrow, MusicNote, Pause } from '@mui/icons-material'
import { AudioProvider, useAudio } from 'contexts/AudioContext'

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

const LayoutContent: React.FC = () => {
  const [showTopBar, setShowTopBar] = useState(false)
  const [isMiddleCollapsed, setIsMiddleCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  
  // 使用 AudioContext
  const { audioRef, isMusicPlaying, setIsMusicPlaying } = useAudio()
  
  const size = useWindowSize()
  const dispatch = useDispatch()

  const routes = useSelector((state: any) => state.routesReducer?.routes || [])
  const currentBlog = useSelector((state: any) => state.currentBlogReducer.currentBlog)
  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)
  const bingUrl = useSelector((state: any) => state.bingPicSliceReducer.bingUrl)
  const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)

  useEffect(() => {
    fetchRoutes(dispatch)
  }, [dispatch])

  // 控制音频播放/暂停
  const toggleMusicPlay = () => {
    const audio = audioRef.current
    if (!audio) {
      console.error('Audio element not found')
      return
    }

    console.log('togglePlay', audioRef, 'isMusicPlaying:', isMusicPlaying)

    if (isMusicPlaying) {
      audio.pause()
    } else {
      audio.play().catch((error) => {
        console.error('播放失败:', error)
      })
    }
    setShowMusicPlayer(!showMusicPlayer)
  }

  // 获取背景图片URL
  const backgroundImageUrl = bingPic?.images?.[currentPic]?.url ? `${bingUrl}${bingPic.images[currentPic].url}` : ''

  // 计算宽度
  const getWidths = () => {
    if (size.width <= 600) {
      return { left: '0%', middle: '100%', right: '0%' }
    }

    if (isMiddleCollapsed) {
      return { left: '0%', middle: '0%', right: '100%' }
    }

    return { left: '25%', middle: '50%', right: '25%' }
  }

  const widths = getWidths()
  const isMobile = size.width <= 600

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
      {/* 移动端导航抽屉 */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            style: {
              width: '80%',
              maxWidth: '300px',
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(5px)',
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
        </Drawer>
      )}

      {/* 移动端目录抽屉 */}
      {isMobile && currentBlog.tocContent && (
        <Drawer
          anchor="right"
          open={mobileTocOpen}
          onClose={() => setMobileTocOpen(false)}
          PaperProps={{
            style: {
              width: '80%',
              maxWidth: '300px',
            },
          }}
        >
          <Box
            style={{
              padding: '20px',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            <MarkdownToc />
          </Box>
        </Drawer>
      )}

      {/* 左侧区域 */}
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
            className="gradient-scrollbar"
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
              padding: isMobile ? '10px' : '24px',
            }}
          >
            <Grid
              className={isMobile ? 'pt-2' : 'pt-5'}
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

        {/* 移动端浮动按钮 */}
        {isMobile && (
          <>
            <Fab
              color="primary"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
              }}
            >
              <MenuIcon />
            </Fab>

            {currentBlog.tocContent && (
              <Fab
                color="secondary"
                aria-label="toc"
                onClick={() => setMobileTocOpen(true)}
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 1000,
                }}
              >
                <TocIcon />
              </Fab>
            )}
          </>
        )}
      </Box>

      {/* 右侧区域 */}
      {size.width > 600 && (
        <Box
          style={{
            width: widths.right,
            height: '100vh',
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
            backgroundSize: isMiddleCollapsed ? 'cover' : '800%',
            backgroundPosition: isMiddleCollapsed ? 'center' : 'right center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            borderLeft: !isMiddleCollapsed ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            transition:
              'width 0.3s ease-in-out, background-size 0.3s ease-in-out, background-position 0.3s ease-in-out',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isMiddleCollapsed ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: isMiddleCollapsed ? 'none' : 'blur(2px)',
              transition: 'background-color 0.3s ease-in-out',
            }}
          />
          <Box
            className="primary-scrollbar"
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
            {isMiddleCollapsed && (
              <>
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
            aria-label="music-tab"
            onClick={toggleMusicPlay}
            sx={{
              position: 'absolute',
              bottom: '100px',
              left: '20px',
              zIndex: 2,
              background: isMusicPlaying
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: isMusicPlaying ? '0 8px 20px rgba(102, 126, 234, 0.4)' : '0 8px 20px rgba(245, 87, 108, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: isMusicPlaying ? 'pulse 2s ease-in-out infinite' : 'none',
              '&:hover': {
                transform: 'scale(1.1) translateY(-2px)',
                boxShadow: isMusicPlaying
                  ? '0 12px 28px rgba(102, 126, 234, 0.6)'
                  : '0 12px 28px rgba(245, 87, 108, 0.6)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '@keyframes pulse': {
                '0%, 100%': {
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                },
                '50%': {
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.7)',
                },
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isMusicPlaying ? (
                <>
                  <Pause
                    fontSize="large"
                    sx={{
                      animation: 'fadeIn 0.3s ease-in-out',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      animation: 'ripple 1.5s ease-out infinite',
                      '@keyframes ripple': {
                        '0%': {
                          transform: 'scale(1)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(1.5)',
                          opacity: 0,
                        },
                      },
                    }}
                  />
                </>
              ) : (
                <MusicNote
                  fontSize="large"
                  sx={{
                    animation: 'bounce 0.5s ease-in-out',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-5px)' },
                    },
                  }}
                />
              )}
            </Box>
          </Fab>

          <Fab
            color="primary"
            aria-label="keyboard-tab"
            onClick={() => {
              setIsMiddleCollapsed(!isMiddleCollapsed)
            }}
            sx={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 2,
              transform: isMiddleCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: isMiddleCollapsed ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)',
              },
            }}
          >
            <KeyboardTab />
          </Fab>
        </Box>
      )}

      {/* 移动端音乐播放按钮 */}
      {isMobile && (
        <Fab
          aria-label="music-tab-mobile"
          onClick={toggleMusicPlay}
          sx={{
            position: 'fixed',
            bottom: '90px',
            left: '20px',
            zIndex: 1000,
            background: isMusicPlaying
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            boxShadow: isMusicPlaying ? '0 8px 20px rgba(102, 126, 234, 0.4)' : '0 8px 20px rgba(245, 87, 108, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: isMusicPlaying ? 'pulse 2s ease-in-out infinite' : 'none',
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
            },
            '@keyframes pulse': {
              '0%, 100%': {
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              },
              '50%': {
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.7)',
              },
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMusicPlaying ? (
              <>
                <Pause fontSize="large" />
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    animation: 'ripple 1.5s ease-out infinite',
                    '@keyframes ripple': {
                      '0%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(1.5)',
                        opacity: 0,
                      },
                    },
                  }}
                />
              </>
            ) : (
              <MusicNote
                fontSize="large"
                sx={{
                  animation: 'bounce 0.5s ease-in-out',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                  },
                }}
              />
            )}
          </Box>
        </Fab>
      )}

      {/* <BackgroundBar showTopBar={showTopBar} /> */}
    </Box>
  )
}

const Layout: React.FC = () => {
  return (
    <AudioProvider>
      <LayoutContent />
    </AudioProvider>
  )
}

export default Layout
