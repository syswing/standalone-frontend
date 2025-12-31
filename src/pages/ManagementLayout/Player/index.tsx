import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Slider,
  Stack,
  Card,
  CardMedia,
  List,
  ListItemButton,
  Divider,
  Grid,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeDown,
  VolumeMute,
  Shuffle,
  Repeat,
  RepeatOne,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import action from 'request/action'

// 样式化组件
const PlayerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}))

const CoverImage = styled('img')({
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
})

const ControlButton = styled(IconButton)({
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
})

const PlayButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  width: 64,
  height: 64,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
})

// 音乐数据类型
interface Track {
  id: number
  title: string
  album: string
  duration: number
  cover: string
  url: string
}

const isDev = process.env.NODE_ENV === 'development'

const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true) // 添加播放列表加载状态

  const currentTrack = playlist[currentTrackIndex]

  // 格式化时间
  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 播放/暂停
  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('播放错误:', error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 上一曲
  const playPrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
  }

  // 下一曲
  const playNext = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
      return
    }

    if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
    }
  }

  // 切换重复模式
  const toggleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  // 切换随机播放
  const toggleShuffle = () => {
    setIsShuffleOn((prev) => !prev)
  }

  // 处理进度条变化
  const handleProgressChange = (_: Event, value: number | number[]) => {
    const newTime = value as number
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // 处理音量变化
  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = value as number
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // 切换静音
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  // 选择歌曲
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play().catch(console.error)
      } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
        playNext()
      } else {
        setIsPlaying(false)
      }
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    const handleError = (e: ErrorEvent) => {
      console.error('音频加载错误:', e)
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError as any)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError as any)
    }
  }, [currentTrackIndex, repeatMode])

  // 切换歌曲时自动播放
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // 重置状态
    setCurrentTime(0)
    setDuration(0)

    if (isPlaying) {
      setIsLoading(true)
      // 等待音频加载后再播放
      const playAudio = async () => {
        try {
          await audio.play()
        } catch (error) {
          console.error('自动播放失败:', error)
          setIsPlaying(false)
        }
      }
      playAudio()
    }
  }, [currentTrackIndex])

  // 初始化音量和获取播放列表
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }

    const fetchPlaylist = async () => {
      setIsPlaylistLoading(true) // 开始加载
      try {
        const result = await action({
          path: '/Music/all',
        })

        console.log('all music :', result)

        // 将后端数据转换为 Track 格式
        if (result?.data && Array.isArray(result.data)) {
          const transformedPlaylist: Track[] = result.data.map((item: any, index: number) => ({
            id: index + 1,
            title: item.name?.replace(/\.(flac|mp3|wav|m4a)$/i, '') || '未知歌曲',
            album: item.album || '未知专辑',
            duration: item.duration || 0,
            cover: (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.coverUrl || 'https://picsum.photos/300/300?random=' + index,
            url: (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.playUrl || '',
          }))

          setPlaylist(transformedPlaylist)
          console.log('Transformed playlist:', transformedPlaylist)
        }
      } catch (error) {
        console.error('获取播放列表失败:', error)
      } finally {
        setIsPlaylistLoading(false) // 加载完成
      }
    }

    fetchPlaylist()
  }, [])

  // 如果播放列表正在加载或为空，显示加载状态
  if (isPlaylistLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6">加载播放列表中...</Typography>
      </Box>
    )
  }

  // 如果播放列表为空，显示空状态
  if (!playlist.length) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6">暂无音乐</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid
        container
        spacing={3}
      >
        {/* 主播放器 */}
        <Grid
          item
          xs={12}
          md={8}
        >
          <PlayerContainer elevation={8}>
            <Grid
              container
              spacing={3}
            >
              {/* 封面 */}
              <Grid
                item
                xs={12}
                sm={5}
              >
                <Card
                  elevation={0}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <CoverImage
                    src={currentTrack?.cover || 'https://picsum.photos/300/300'}
                    alt={currentTrack?.title || '未知歌曲'}
                  />
                </Card>
              </Grid>

              {/* 控制区域 */}
              <Grid
                item
                xs={12}
                sm={7}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* 歌曲信息 */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      {currentTrack?.title || '未知歌曲'}
                    </Typography>
                  </Box>

                  {/* 进度条 */}
                  <Box sx={{ mb: 2 }}>
                    <Slider
                      value={currentTime}
                      max={duration || 100}
                      onChange={handleProgressChange}
                      sx={{
                        color: '#fff',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">{formatTime(currentTime)}</Typography>
                      <Typography variant="caption">{formatTime(duration)}</Typography>
                    </Box>
                  </Box>

                  {/* 播放控制按钮 */}
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <ControlButton
                      onClick={toggleShuffle}
                      color={isShuffleOn ? 'primary' : 'default'}
                    >
                      <Shuffle />
                    </ControlButton>
                    <ControlButton onClick={playPrevious}>
                      <SkipPrevious fontSize="large" />
                    </ControlButton>
                    <PlayButton onClick={togglePlay}>
                      {isLoading ? (
                        <Typography variant="body2">⏳</Typography>
                      ) : isPlaying ? (
                        <Pause fontSize="large" />
                      ) : (
                        <PlayArrow fontSize="large" />
                      )}
                    </PlayButton>
                    <ControlButton onClick={playNext}>
                      <SkipNext fontSize="large" />
                    </ControlButton>
                    <ControlButton onClick={toggleRepeatMode}>
                      {repeatMode === 'one' ? (
                        <RepeatOne color="primary" />
                      ) : (
                        <Repeat color={repeatMode === 'all' ? 'primary' : 'inherit'} />
                      )}
                    </ControlButton>
                  </Stack>

                  {/* 音量控制 */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <ControlButton
                      onClick={toggleMute}
                      size="small"
                    >
                      {isMuted || volume === 0 ? <VolumeMute /> : volume < 50 ? <VolumeDown /> : <VolumeUp />}
                    </ControlButton>
                    <Slider
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      sx={{
                        color: '#fff',
                        maxWidth: 120,
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </PlayerContainer>
        </Grid>

        {/* 播放列表 */}
        <Grid
          item
          xs={12}
          md={4}
        >
          <Paper
            elevation={3}
            sx={{ p: 2, maxHeight: 500, overflow: 'auto' }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              播放列表
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {playlist.map((track, index) => (
                <React.Fragment key={track.id}>
                  <ListItemButton
                    selected={currentTrackIndex === index}
                    onClick={() => selectTrack(index)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 50, height: 50, borderRadius: 1, mr: 2 }}
                        image={track.cover}
                        alt={track.title}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {track.title}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentTrack?.url || ''}
      />
    </Box>
  )
}

export default Player
