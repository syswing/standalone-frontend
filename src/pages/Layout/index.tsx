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
import { useNavigate, useLocation, redirect ,Outlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import MatchedLink from './MatchedLink'

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
  const [showTopBar, setShowTopBar] = useState(false) // 动效开关
  const routes = useSelector((state: any) => state.routesReducer.routes)

  return (
    <Box
      style={{
        overflow: 'auto',
        width: '100%',
        height: '100vh',
        backgroundColor: '#ebebeb',
      }}
    >
      <Container
        className="absolute z-10"
        style={{
          transform: 'translateX(-50%)',
          left: '50%',
        }}
      >
        <Grid
          className="pt-5"
          container
          spacing={1}
        >
          <Grid
            item
            xs={4}
          >
            {routes.map((item: any, index: number) => {
              return (
                <MatchedLink
                  key={index}
                  path={item.path}
                  name={item.name}
                />
              )
            })}
          </Grid>
          <Grid
            item
            xs={8}
          >
            <Card
              style={{
                backgroundColor: 'transparent',
                overflow: 'hidden',
                boxShadow: 'none',
              }}
            >
              <Outlet />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <BackgroundBar showTopBar={showTopBar} />
    </Box>
  )
}

export default Layout
