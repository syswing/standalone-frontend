import React from 'react'
import { Box, Typography, Paper, TextField, Button, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRequest } from 'ahooks'
import action from 'request/action'

// 饥荒风格的容器
const DSTContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%)',
  padding: '40px 20px',
  fontFamily: '"Bellerose", "Arial", sans-serif',
})

// 饥荒风格的纸张效果
const DSTPaper = styled(Paper)({
  background: 'linear-gradient(135deg, #f4e4c1 0%, #e8d4a8 100%)',
  border: '4px solid #3d2817',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.1)',
  padding: '30px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
    pointerEvents: 'none',
  },
})

// 服务器卡片
const ServerCard = styled(Box)({
  background: 'linear-gradient(135deg, #f9f3e3 0%, #ede1c5 100%)',
  border: '3px solid #5d4a3a',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    borderColor: '#8b6f47',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '30px',
    height: '30px',
    background: 'radial-gradient(circle, #ff6b6b 0%, transparent 70%)',
    opacity: 0.3,
    borderRadius: '50%',
  },
})

// 饥荒风格的标题
const DSTTitle = styled(Typography)({
  color: '#3d2817',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  marginBottom: '30px',
  textAlign: 'center',
  fontSize: '48px',
  fontFamily: '"Bellerose", "Arial Black", sans-serif',
  letterSpacing: '2px',
})

// 饥荒风格的按钮
const DSTButton = styled(Button)({
  background: 'linear-gradient(135deg, #8b6f47 0%, #6d5638 100%)',
  color: '#f4e4c1',
  border: '3px solid #3d2817',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #a0845a 0%, #8b6f47 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
})

// 饥荒风格的输入框
const DSTTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: '#f9f3e3',
    border: '2px solid #5d4a3a',
    borderRadius: '6px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      borderColor: '#8b6f47',
    },
    '&.Mui-focused': {
      borderColor: '#8b6f47',
      boxShadow: '0 0 8px rgba(139, 111, 71, 0.3)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#5d4a3a',
    fontWeight: 'bold',
  },
})

// 饥荒风格的标签
const DSTChip = styled(Chip)({
  background: 'linear-gradient(135deg, #6d5638 0%, #5d4a3a 100%)',
  color: '#f4e4c1',
  border: '2px solid #3d2817',
  fontWeight: 'bold',
  fontSize: '12px',
  height: '28px',
  '& .MuiChip-label': {
    padding: '0 12px',
  },
})

export default () => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const { data, error, loading } = useRequest(async () => {
    const result = await action({
      path: '/dst/getAllCacheRegionLobbies',
      params: {
        page: 1,
        size: 9999,
      },
    })
    return result as any
  })

  console.log('data', data)

  const servers1 = data?.data?.reduce((acc: any[], lobby: any) => {
    return acc?.concat(lobby.data.GET)
  }, [])

  console.log('DST Lobbies Data:', servers1, error, loading)

  // 模拟服务器数据
  const temp = {
    allownewplayers: true,
    clanonly: false,
    clienthosted: true,
    connected: 2,
    dedicated: true,
    fo: true,
    guid: '1083955668943670887',
    host: 'KU_s18skgPa',
    intent: 'endless',
    lanonly: false,
    maxconnections: 4,
    mode: 'survival',
    mods: false,
    name: 'My World',
    ownernetid: 'P:5009661903533029476',
    password: false,
    platform: 19,
    port: 10999,
    psnsessionid: '2c5ebe70-9423-40c5-8b51-14bc892415d2',
    pvp: false,
    season: 'summer',
    secondaries: {
      14290457: {
        id: '14290457',
        port: 10998,
        steamid: 'P:5009661903533029476',
        __addr: '71.83.238.135',
      },
    },
    serverpaused: false,
    session: '8FB6400A86540480',
    steamid: 'P:5009661903533029476',
    steamroom: '1',
    tags: 'WS:BA,english,survival,friendsonly,caves',
    v: 697337000,
    __addr: '71.83.238.135',
    __rowId: 'KU_s18skgPa',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4caf50'
      case 'full':
        return '#ff9800'
      default:
        return '#f44336'
    }
  }

  const getSeasonIcon = (season: string) => {
    const icons: { [key: string]: string } = {
      春季: '🌸',
      夏季: '☀️',
      秋季: '🍂',
      冬季: '❄️',
    }
    return icons[season] || '🌍'
  }

  return (
    <DSTContainer>
      <DSTPaper elevation={8}>
        {/* <DSTTitle variant="h3">饥荒联机版 - 服务器列表</DSTTitle> */}

        {/* 搜索栏 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <DSTTextField
            fullWidth
            label="搜索服务器"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入服务器名称..."
          />
          <DSTButton variant="contained">搜索</DSTButton>
          <DSTButton variant="contained">刷新</DSTButton>
        </Box>

        {/* 服务器列表 */}
        <Box>
          {servers1?.map((server) => (
            <ServerCard key={server.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#3d2817',
                        fontWeight: 'bold',
                        fontSize: '24px',
                      }}
                    >
                      {server.name}
                    </Typography>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(server.status),
                        boxShadow: `0 0 8px ${getStatusColor(server.status)}`,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold' }}>👥 玩家: {server.players}</Typography>
                    <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold' }}>
                      {getSeasonIcon(server.season)} {server.season}
                    </Typography>
                    <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold' }}>📅 {server.day}</Typography>
                    <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold' }}>📡 延迟: {server.ping}ms</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {server.mods.map((mod, index) => (
                      <DSTChip
                        key={index}
                        label={mod}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>

                <DSTButton
                  variant="contained"
                  sx={{ ml: 2 }}
                  disabled={server.status === 'full'}
                >
                  {server.status === 'full' ? '已满' : '加入'}
                </DSTButton>
              </Box>
            </ServerCard>
          )) || <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold', fontSize: '18px' }}>暂无服务器数据</Typography>}
        </Box>

        {/* 底部统计 */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '3px solid #5d4a3a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold', fontSize: '16px' }}>
            🔥 在线服务器: {servers1.length} 个
          </Typography>
          <Typography sx={{ color: '#5d4a3a', fontWeight: 'bold', fontSize: '16px' }}>
            👥 总玩家数: {servers1.reduce((acc, s) => acc + parseInt(s.players.split('/')[0]), 0)} 人
          </Typography>
        </Box>
      </DSTPaper>
    </DSTContainer>
  )
}
