
import React, { useEffect, useState } from 'react'
import action from '../../../request/action'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Checkbox,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  MusicNote,
  Album,
  Person,
  AccessTime,
  LibraryMusic,
  Delete,
  CloudUpload,
  DeleteSweep,
} from '@mui/icons-material'
import useSnackbar from '../../../components/SnackbarProvider/useSnackbar'

interface MusicFile {
  id: number
  name: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  playUrl: string
  fileName?: string
}
const isDev = process.env.NODE_ENV === 'development'

// 默认封面组件
const DefaultCover: React.FC<{ size?: number }> = ({ size = 50 }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <LibraryMusic
        sx={{
          fontSize: size * 0.5,
          color: 'white',
          opacity: 0.9,
        }}
      />
    </Box>
  )
}

// 封面图片组件（带错误处理）
const MusicCover: React.FC<{ src: string; alt: string; size?: number }> = ({ src, alt, size = 50 }) => {
  const [imageError, setImageError] = useState(false)

  if (imageError || !src) {
    return <DefaultCover size={size} />
  }

  return (
    <CardMedia
      component="img"
      sx={{
        width: size,
        height: size,
        borderRadius: 1,
        objectFit: 'cover',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      image={src}
      alt={alt}
      onError={() => setImageError(true)}
    />
  )
}

const ManagementLayoutMusicIndex: React.FC = () => {
  const [musicList, setMusicList] = useState<MusicFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMusic, setSelectedMusic] = useState<MusicFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // 新增：选中的音乐ID列表
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false) // 新增：批量删除对话框
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { showSnackbar } = useSnackbar()

  // 格式化时间
  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // 获取音乐列表
  const fetchMusicList = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await action({
        path: '/Music/all',
      })

      console.log('Music API Response:', result)

      if (result?.data && Array.isArray(result.data)) {
        const transformedList: MusicFile[] = result.data.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name?.replace(/\.(flac|mp3|wav|m4a)$/i, '') || '未知歌曲',
          artist: item.artist || '未知艺术家',
          album: item.album || '未知专辑',
          duration: item.duration || 0,
          coverUrl: item.coverUrl
            ? (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.coverUrl
            : '',
          playUrl: (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + item.playUrl || '',
          fileName: item.fileName || item.name, // 保存原始文件名用于删除
        }))

        setMusicList(transformedList)
      } else {
        setError('获取音乐列表失败：数据格式错误')
      }
    } catch (err) {
      console.error('Failed to fetch music list:', err)
      setError('获取音乐列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMusicList()
  }, [])

  // 播放/暂停音乐
  const togglePlay = (music: MusicFile) => {
    if (!audioRef.current) return

    if (playingId === music.id) {
      audioRef.current.pause()
      setPlayingId(null)
    } else {
      audioRef.current.src = music.playUrl
      audioRef.current.play().catch(console.error)
      setPlayingId(music.id)
    }
  }

  // 打开删除确认对话框
  const handleDeleteClick = (music: MusicFile) => {
    setSelectedMusic(music)
    setDeleteDialogOpen(true)
  }

  // 确认删除
  const handleDeleteConfirm = async () => {
    if (!selectedMusic) return

    try {
      const result = (await action({
        path: '/Music/delete',
        params: {
          filePaths: [selectedMusic.fileName],
        },
      })) as any

      if (result.data.success) {
        showSnackbar('删除成功', 'success')
        // 刷新列表
        await fetchMusicList()
        // 如果正在播放被删除的音乐，停止播放
        if (playingId === selectedMusic.id) {
          audioRef.current?.pause()
          setPlayingId(null)
        }
      } else {
        showSnackbar('删除失败：' + (result.data.message || '未知错误'), 'error')
      }
    } catch (error) {
      console.error('Delete error:', error)
      showSnackbar('删除失败，请稍后重试', 'error')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedMusic(null)
    }
  }

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList
    setUploading(true)

    const formFiles = [] as any

    const formData = new FormData()
    // 添加所有选中的文件
    Array.from(files).forEach((file) => {
      formFiles.push(file)
    })

    formData.append('files', formFiles)

    if (!files || files.length === 0) return

    try {
      const result = (await action({
        path: '/Music/upload',
        params: {
          files: files[0],
        },
      })) as any

      if (result.data.success) {
        showSnackbar(`成功上传 ${files.length} 个文件`, 'success')
        // 刷新列表
        await fetchMusicList()
      } else {
        showSnackbar('上传失败：' + (result.data.message || '未知错误'), 'error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      showSnackbar('上传失败，请稍后重试', 'error')
    } finally {
      setUploading(false)
      // 清空文件选择
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 新增：全选/取消全选
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(musicList.map((music) => music.id))
    } else {
      setSelectedIds([])
    }
  }

  // 新增：单个选择
  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // 新增：批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return

    const selectedMusicFiles = musicList.filter((music) => selectedIds.includes(music.id))
    const fileNames = selectedMusicFiles.map((music) => music.fileName).filter(Boolean)

    try {
      const result = (await action({
        path: '/Music/delete',
        params: {
          filePaths: fileNames,
        },
      })) as any

      if (result.data.success) {
        showSnackbar(`成功删除 ${selectedIds.length} 首歌曲`, 'success')
        // 刷新列表
        await fetchMusicList()
        // 如果正在播放被删除的音乐，停止播放
        if (playingId && selectedIds.includes(playingId)) {
          audioRef.current?.pause()
          setPlayingId(null)
        }
        // 清空选择
        setSelectedIds([])
      } else {
        showSnackbar('删除失败：' + (result.data.message || '未知错误'), 'error')
      }
    } catch (error) {
      console.error('Batch delete error:', error)
      showSnackbar('批量删除失败，请稍后重试', 'error')
    } finally {
      setBatchDeleteDialogOpen(false)
    }
  }

  //
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setPlayingId(null)
    }

    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 标题区域 */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          flexShrink: 0, // 防止被压缩
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            <MusicNote fontSize="large" />
            音乐库管理
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            共 {musicList.length} 首音乐
            {selectedIds.length > 0 && ` · 已选择 ${selectedIds.length} 首`}
          </Typography>
        </Box>

        {/* 按钮组 */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* 批量删除按钮 */}
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={() => setBatchDeleteDialogOpen(true)}
              sx={{
                boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
              }}
            >
              批量删除 ({selectedIds.length})
            </Button>
          )}

          {/* 上传按钮 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.zip"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            startIcon={uploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              color: 'white',
              '&.Mui-disabled': {
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: '#fff',
                opacity: 0.8,
              },
            }}
          >
            {uploading ? '上传中...' : '上传音乐'}
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{ mb: 4, flexShrink: 0 }} // 防止被压缩
      >
        <Grid
          item
          xs={12}
          sm={4}
        >
          <Card
            elevation={2}
            sx={{ p: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MusicNote
                fontSize="large"
                color="primary"
              />
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {musicList.length}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  总歌曲数
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <Card
            elevation={2}
            sx={{ p: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person
                fontSize="large"
                color="secondary"
              />
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {new Set(musicList.map((m) => m.artist)).size}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  艺术家数量
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <Card
            elevation={2}
            sx={{ p: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Album
                fontSize="large"
                color="success"
              />
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {new Set(musicList.map((m) => m.album)).size}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  专辑数量
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3, flexShrink: 0 }} />

      {/* 音乐列表表格 */}
      <TableContainer
        component={Paper}
        elevation={3}
        className="gradient-scrollbar"
        sx={{ 
          flex: 1, // 占据剩余空间
          overflow: 'auto',
          minHeight: 0, // 重要：允许 flex 子元素缩小
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}
                width="60px"
                padding="checkbox"
              >
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < musicList.length}
                  checked={musicList.length > 0 && selectedIds.length === musicList.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': {
                      color: '#fff',
                    },
                    '&.MuiCheckbox-indeterminate': {
                      color: '#fff',
                    },
                  }}
                />
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}
                width="60px"
              >
                #
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}
                width="80px"
              >
                封面
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}>
                歌曲名称
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}
                align="center"
              >
                时长
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: '#fff' }}
                align="center"
                width="100px"
              >
                操作
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {musicList.map((music, index) => (
              <TableRow
                key={music.id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  backgroundColor: playingId === music.id ? 'action.selected' : 'inherit',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(music.id)}
                    onChange={() => handleSelectOne(music.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <MusicCover
                    src={music.coverUrl}
                    alt={music.name}
                    size={50}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    fontWeight={playingId === music.id ? 'bold' : 'normal'}
                  >
                    {music.name}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">{formatDuration(music.duration)}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      color={playingId === music.id ? 'primary' : 'default'}
                      onClick={() => togglePlay(music)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      {playingId === music.id ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(music)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'error.light',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>确定要删除歌曲 "{selectedMusic?.name}" 吗？此操作不可撤销。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            确定删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 批量删除确认对话框 */}
      <Dialog
        open={batchDeleteDialogOpen}
        onClose={() => setBatchDeleteDialogOpen(false)}
      >
        <DialogTitle>确认批量删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除选中的 {selectedIds.length} 首歌曲吗？此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDeleteDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleBatchDelete}
            color="error"
            variant="contained"
          >
            确定删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} />
    </Box>
  )
}

export default ManagementLayoutMusicIndex
