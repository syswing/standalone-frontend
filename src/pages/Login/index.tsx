import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import useSnackbar from "../../components/SnackbarProvider/useSnackbar"
import action from 'request/action';

type FormValues = {
  username: string;
  password: string;
};

export default () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Replace with your actual authentication API call
      // const response = await loginApi(data.username, data.password);
      
      // Simulate API call
      const result = await action({
        path: '/user/login',
        params: {
          username: data.username,
          password: data.password,
        },
      })
      
      localStorage.setItem('standalone-token', result.data.access_token);

      showSnackbar('登录成功', 'success');

      navigate('/management', { replace: true });
    } catch (error) {
      showSnackbar('登录失败，请稍后重试', 'error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <LockOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h5">
              后台管理系统
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: '请输入用户名' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="用户名"
                  autoComplete="username"
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: '请输入密码' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : '登录'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};