import React, { useState, useEffect } from 'react'
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
  styled,
  CircularProgress,
  Pagination,
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
import action from 'request/action'
import { useAudio } from 'contexts/AudioContext'
import { throttle, debounce } from 'lodash'

interface Track {
  id: number
  title: string
  duration: number
  cover: string
  url: string
}

const PlayerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}))

const CoverImage = styled(CardMedia)({
  width: '100%',
  paddingTop: '100%',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
})

const PlaylistItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
}))

const isDev = process.env.NODE_ENV === 'development'
const ITEMS_PER_PAGE = 8 // 每页显示10首歌

const MusicPlayer: React.FC = () => {
  const { audioRef, isMusicPlaying, setIsMusicPlaying } = useAudio()
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1) // 当前页码

  const currentTrack = playlist[currentTrackIndex]

  // 计算分页
  const totalPages = Math.ceil(playlist.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPagePlaylist = playlist.slice(startIndex, endIndex)

  // 格式化时间
  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 播放/暂停
  const togglePlay = async () => {
    console.log('togglePlay', audioRef)
    if (!audioRef.current) return

    try {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        setIsLoading(true)
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('播放错误:', error)
      setIsMusicPlaying(false)
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
  
  // 处理进度条变化（实时更新UI）
  const handleProgressChange = (_: Event, value: number | number[]) => {
    const newTime = value as number
    setCurrentTime(newTime)
  }

  // 处理进度条变化完成（用户释放滑块时更新音频）
  const handleProgressChangeCommitted = (_: Event | React.SyntheticEvent, value: number | number[]) => {
    console.log('handleProgressChangeCommitted', value)
    const newTime = value as number
    if (audioRef.current) {
      // audioRef.current.currentTime = newTime
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

  //  
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  // 选择歌曲
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    // 不在这里设置播放状态，让音频事件监听器处理
  }

  // 处理分页变化
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  // 当选中的歌曲改变时，自动跳转到对应页面
  useEffect(() => {
    console.log('3')
    const pageOfCurrentTrack = Math.floor(currentTrackIndex / ITEMS_PER_PAGE) + 1
    if (pageOfCurrentTrack !== currentPage) {
      setCurrentPage(pageOfCurrentTrack)
    }
  }, [currentTrackIndex])

  // 音频事件监听
  useEffect(() => {
    console.log('2')
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      console.log('updateTime')
      return setCurrentTime(audio.currentTime)
    }
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
        setIsMusicPlaying(false)
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
      setIsMusicPlaying(false)
    }

    const handlePlay = () => {
      setIsMusicPlaying(true)
    }

    const handlePause = () => {
      setIsMusicPlaying(false)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError as any)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError as any)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [currentTrackIndex, repeatMode, audioRef, setIsMusicPlaying])

  // 切换歌曲时自动播放
  useEffect(() => {
    console.log('4')
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // 重置状态
    setCurrentTime(0)
    setDuration(0)

    // 设置新的音频源
    audio.src = currentTrack.url

    if (isMusicPlaying) {
      setIsLoading(true)
      const playAudio = async () => {
        try {
          await audio.play()
        } catch (error) {
          console.error('自动播放失败:', error)
          setIsMusicPlaying(false)
        }
      }
      playAudio()
    }
  }, [currentTrackIndex, currentTrack])

  // 初始化音量和获取播放列表
  useEffect(() => {
    console.log('5')
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }

    const fetchPlaylist = async () => {
      setIsPlaylistLoading(true)
      try {
        const result = await action({
          path: '/Music/all',
        })

        console.log('all music :', result)

        if (result?.data && Array.isArray(result.data)) {
          const transformedPlaylist: Track[] = result.data.map((item: any, index: number) => ({
            id: index + 1,
            title: item.name?.replace(/\.(flac|mp3|wav|m4a)$/i, '') || '未知歌曲',
            duration: item.duration || 0,
            cover:
              (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.coverUrl ||
              'https://picsum.photos/300/300?random=' + index,
            url: (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.playUrl || '',
          }))

          setPlaylist(transformedPlaylist)
          console.log('Transformed playlist:', transformedPlaylist)
        }
      } catch (error) {
        console.error('获取播放列表失败:', error)
      } finally {
        setIsPlaylistLoading(false)
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
    <PlayerContainer>
      <Grid
        container
        spacing={3}
      >
        {/* 左侧封面和控制 */}
        <Grid
          item
          xs={12}
          md={4}
        >
          <Card sx={{ height: '100%', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CoverImage image={currentTrack?.cover} />
          </Card>
        </Grid>

        {/* 右侧播放控制 */}
        <Grid
          item
          xs={12}
          md={8}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
            >
              {currentTrack?.title}
            </Typography>
          </Box>

          {/* 进度条 */}
          <Box sx={{ mb: 2 }}>
            <Slider
              value={currentTime}
              min={0}
              max={duration || 100}
              onChange={handleProgressChange}
              onChangeCommitted={handleProgressChangeCommitted}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'white',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption">{formatTime(currentTime)}</Typography>
              <Typography variant="caption">{formatTime(duration)}</Typography>
            </Box>
          </Box>

          {/* 控制按钮 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 3 }}>
            <IconButton
              onClick={toggleShuffle}
              sx={{ color: 'white' }}
            >
              <Shuffle sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={playPrevious}
              sx={{ color: 'white' }}
            >
              <SkipPrevious sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              onClick={togglePlay}
              disabled={isLoading}
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                '&:hover': { backgroundColor: '#f0f0f0' },
                width: 50,
                height: 50,
              }}
            >
              {isLoading ? (
                <CircularProgress
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                  }}
                  size={24}
                />
              ) : isMusicPlaying ? (
                <Pause sx={{ fontSize: 30 }} />
              ) : (
                <PlayArrow sx={{ fontSize: 30 }} />
              )}
            </IconButton>
            <IconButton
              onClick={playNext}
              sx={{ color: 'white' }}
            >
              <SkipNext sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              onClick={toggleRepeatMode}
              sx={{ color: 'white' }}
            >
              {repeatMode === 'off' ? (
                <Repeat sx={{ fontSize: 20 }} />
              ) : repeatMode === 'all' ? (
                <Repeat sx={{ fontSize: 20 }} />
              ) : (
                <RepeatOne sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Box>

          {/* 音量控制 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={toggleMute}
              sx={{ color: 'white' }}
            >
              {isMuted || volume === 0 ? <VolumeMute sx={{ fontSize: 20 }} /> : <VolumeUp sx={{ fontSize: 20 }} />}
            </IconButton>
            <Slider
              value={volume}
              min={0}
              max={100}
              onChange={handleVolumeChange}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'white',
                },
              }}
            />
          </Box>
        </Grid>

        {/* 播放列表 */}
        <Grid
          item
          xs={12}
        >
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            播放列表
          </Typography>
          <List>
            {currentPagePlaylist.map((track, index) => {
              const actualIndex = startIndex + index
              return (
                <React.Fragment key={track.id}>
                  <PlaylistItem
                    selected={actualIndex === currentTrackIndex}
                    onClick={() => selectTrack(actualIndex)}
                    sx={{
                      backgroundColor: actualIndex === currentTrackIndex ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{track.title}</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7 }}
                    >
                      {formatTime(track.duration)}
                    </Typography>
                  </PlaylistItem>
                  {index < currentPagePlaylist.length - 1 && <Divider />}
                </React.Fragment>
              )
            })}
          </List>
          {/* 分页组件 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: 'white',
                    color: '#667eea',
                  },
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </PlayerContainer>
  )
}

export default MusicPlayer
