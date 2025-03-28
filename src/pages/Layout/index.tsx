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
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import { fetchBingPic } from '../../hooks/useApi'
import useWindowSize from 'hooks/useWindowSize'


// 'box-shadow:
// rgba(0, 0, 0, 0.4) 0px 2px 4px,
// rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
// rgba(0, 0, 0, 0.2) 0px -3px 0px inset;'
const NavBtnShadow = styled.div(({ theme }) => ({
  boxShadow:
    'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;',
  // filter: 'blur(8px)',
}))

const PositionDiv = (props) => {
  return (
    <div
      style={{
        zIndex: 9,
        // position:'fixed'
      }}
      className={props.className}
    >
      {props.children}
    </div>
  )
}
const PositionDivWarp = styled(PositionDiv)<any>(({ left, top, color, width, minWidth }) => {
  return {
    position: 'absolute',
    left: left,
    top: top,
    transform: 'translate(-50%,-50%)',
    color: color,
    width: width,
    minWidth: minWidth,
  }
})


const barTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(255, 255, 255, 0.1)',
    },
  },
})

const BackgroundBar = ({ showTopBar }) => {
  const dispatch = useDispatch()
  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)

  const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)

  const location = useLocation()

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

  const dispatch = useDispatch()

  const [showTopBar, setShowTopBar] = useState(false)
  // const navigate = useNavigate()

  // const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)
  // const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)
  // const bingUrl = useSelector((state:any) => state.bingPicSliceReducer.bingUrl)

  const routes = useSelector((state: any) => state.routesReducer.routes)
  // console.log('routes', routes)


  // console.log('currentPic',currentPic,bingPic)
  
  // useEffect(() => {
  //   console.log('**')
  //   fetchBingPic(dispatch)
  // }, [])

  return (
    <Box
      style={{
        overflow: 'auto',
        width: '100%',
        height: '100vh',
        backgroundColor: '#ebebeb',
        // backgroundImage: `url(${bingUrl}${bingPic.images[currentPic].url})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // opacity: '0.5',
      }}
    >
      <Container className='absolute z-10' style={{
        transform: 'translateX(-50%)',
        left: '50%',
      }}>
        <Grid className="pt-5" container spacing={1}>
          <Grid item xs={4}>
            {routes.map((item: any, index: number) => {
              return (
                <NavBtnShadow key={index} className='px-3 py-2 mb-2 glass'>
                  {item.name}
                </NavBtnShadow>
              )
            })}

            {/* <Card className="p-10" sx={{ maxWidth: 345 }}>
              <BounceAvatar
                sx={{ width: 88, height: 88 }}
                alt="syswing"
                src={AvatarImg}
              />
              <Quote>{bingPic.images[currentPic]?.copyright}</Quote>
              <Quote float="right">----@bing {bingPic.images[currentPic]?.title}</Quote>
            </Card> */}
          </Grid>
          <Grid item xs={8}>
            <Card style={{
              backgroundColor: 'transparent',
              overflow: 'hidden',
              boxShadow:'none'
            }}>
              {/* <NavBar
                showTopBar={showTopBar}
                handleChangeShowTopBar={(e) => {
                  setShowTopBar(e.target.checked)
                }}
              /> */}
              <Outlet />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <BackgroundBar showTopBar={showTopBar}/>
    </Box>
  )
}

export default Layout
