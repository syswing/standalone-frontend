import { Grid, Paper, CircularProgress, Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'github-markdown-css/github-markdown.css'
import useWindowSize from 'hooks/useWindowSize'
import action from 'request/action'
import { useParams, useNavigate } from 'react-router-dom'
import DeepseekChat from 'components/DeepseekChat'
import { setBlogMd } from 'store/currentBlog'

export default () => {
  const divRef = React.useRef<any>(null)
  const size = useWindowSize()
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const articleName = params.articleName

  const [currentBlog, setCurrentBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()

  const visitMd = React.useCallback(async () => {
    if (!articleName) {
      setError('文章名称不存在')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await action({
        path: '/adventure/visitMd',
        params: {
          articleName: articleName,
        },
      })
      
      if (result?.data) {
        setCurrentBlog(result.data)
        dispatch(setBlogMd(result.data))
      } else {
        setError('文章内容加载失败')
      }
    } catch (err) {
      console.error('Failed to load article:', err)
      setError('加载文章时出错，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [articleName])

  useEffect(() => {
    visitMd()
    return () => {
      dispatch(setBlogMd({ currentBlog: ''  }))
    }
  }, [visitMd])

  useEffect(() => {
    const checkScrollbar = () => {
      if (divRef.current) {
        setIsScrollbarVisible(divRef.current.scrollHeight > divRef.current.clientHeight)
      }
    }

    checkScrollbar()

    // Optional: Add a resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(checkScrollbar)
    if (divRef.current) {
      resizeObserver.observe(divRef.current)
    }

    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current)
      }
    }
  }, [currentBlog])

  console.log('currentBlog: ', currentBlog)

  // 加载状态
  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs>
          <Paper
            elevation={4}
            style={{
              height: (size?.height || 0) - 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CircularProgress />
          </Paper>
        </Grid>
      </Grid>
    )
  }

  // 错误状态
  if (error) {
    return (
      <Grid container spacing={2}>
        <Grid item xs>
          <Paper
            elevation={4}
            style={{
              height: (size?.height || 0) - 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              padding: 20,
            }}
          >
            <Alert 
              severity="error" 
              action={
                <button onClick={() => navigate('/articles')}>返回列表</button>
              }
            >
              {error}
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    )
  }

  // 空数据状态
  if (!currentBlog) {
    return (
      <Grid container spacing={2}>
        <Grid item xs>
          <Paper
            elevation={4}
            style={{
              height: (size?.height || 0) - 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Alert severity="warning">文章不存在</Alert>
          </Paper>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs
        style={{
          overflow: 'hidden',
          paddingRight: size.width > 600 ? 0 : 10,
          backdropFilter: 'blur(20px)',
        }}
      >
        <Paper
          ref={divRef}
          elevation={4}
          style={{
            height: (size?.height || 0) - 40,
            overflowY: 'auto',
            marginRight: isScrollbarVisible ? '-15px' : 0,
            scrollbarWidth: isScrollbarVisible ? 'auto' : 'none',
            msOverflowStyle: isScrollbarVisible ? 'auto' : 'none',
            background: 'transparent',
          }}
          sx={{
            '&::-webkit-scrollbar': {
              display: isScrollbarVisible ? 'auto' : 'none',
            },
          }}
        >
          {currentBlog.name === 'deepseek测试' ? (
            <DeepseekChat />
          ) : (
            <div
              className="markdown-body"
              style={{
                padding: 20,
                marginBottom: 20,
                minHeight: 150,
                background: 'transparent',
              }}
              dangerouslySetInnerHTML={{ __html: currentBlog.md || '' }}
            ></div>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}