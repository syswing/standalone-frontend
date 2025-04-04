import React from 'react'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import action from '../../request/action'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
const QQMusic = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const saveCookie = async (data: any) => {
    const result = await action({
      path: '/QQMusic/setUserCookie',
      params: {
        cookies: data.cookies,
      },
    })
    if (result) {
      navigate('/userinfo', {
        replace: true,
      })
    }
  }

  return (
    <Container className="glass rounded-md">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 2 },
        }}
      >
        <TextField
          {...register('cookies')}
          required
          fullWidth
          id="user-cookie"
          label="cookie"
          variant="outlined"
          helperText="请先前往qq音乐网页复制cookie"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 2 },
        }}
      >
        <Button
          variant="contained"
          onClick={handleSubmit(saveCookie)}
        >
          保存cookie
        </Button>
      </Box>
    </Container>
  )
}

export default QQMusic
