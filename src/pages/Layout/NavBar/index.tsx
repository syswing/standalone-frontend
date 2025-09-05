import ListItemButton from '@mui/material/ListItemButton'
import * as colors from '@mui/material/colors'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { Box, Button, FormControlLabel, ListItemText, Stack, Switch, Typography, List } from '@mui/material'
import shadows from '@mui/material/styles/shadows'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
import React from 'react'

const StyledListItemButton = styled(ListItemButton)<{ component?: React.ElementType; color: string; matched?: number }>(
  ({ color, matched }) => {
    const matchedStyle = matched
      ? {
          color: '#fff',
          backgroundColor: colors[`${color}`][400],
          boxShadow: shadows[2],
        }
      : {}
    const styles = {
      transition: 'all ease .3s',
      borderRadius: '8px',
      marginBottom: '4px',
      width: '100%',
      minHeight: '48px',
      padding: '12px 16px',
      ...matchedStyle,
      '&:hover': {
        color: '#fff',
        backgroundColor: colors[`${color}`][400],
        transform: 'translateX(4px)',
      },
      '& > a': {
        textDecoration: 'none',
        color: 'currentColor',
      },
    }
    return styles
  },
)

const MatchedLink = ({ to, primary }) => {
  // 匹配子路由
  const match = useMatch({
    path: to,
    caseSensitive: false, // 大小写敏感
    end: false, //是否全匹配
  })

  return (
    <Link
      style={{
        textDecoration: 'none',
        color: 'currentColor',
        display: 'block',
        width: '100%',
      }}
      to={to}
    >
      <StyledListItemButton 
        matched={match ? 1 : 0} 
        color={'blue'}
        sx={{
          width: '100%',
          minHeight: '48px',
          borderRadius: '8px',
          marginBottom: '4px',
          padding: '12px 16px',
        }}
      >
        <ListItemText
          sx={{ my: 0 }}
          primary={primary}
          primaryTypographyProps={{
            fontSize: 16,
            fontWeight: match ? 'bold' : 'medium',
            letterSpacing: 0.5,
            lineHeight: 1.2,
          }}
        />
      </StyledListItemButton>
    </Link>
  )
}

const NavBar = ({ routes = [] } : any) => {
  // 过滤掉已删除和非激活的路由
  const activeRoutes = routes.filter(route => !route.isDeleted && route.isActive)

  return (
    <Box>
      <List>
        {activeRoutes.map((route) => (
          <MatchedLink 
            key={route.id} 
            to={route.path} 
            primary={route.title || route.name} 
          />
        ))}
      </List>
    </Box>
  )
}

export default NavBar