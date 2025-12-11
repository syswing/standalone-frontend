import { Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'github-markdown-css/github-markdown.css'
import MarkdownToc from './MarkdownToc'
import useWindowSize from 'hooks/useWindowSize'
import action from 'request/action'
import { setBlogMd } from '../../../store/currentBlog';

import DeepseekChat from 'components/DeepseekChat'

export default () => {
  const currentBlog = useSelector((state: any) => state.currentBlogReducer.currentBlog)
  const divRef = React.useRef<any>(null)
  const size = useWindowSize()
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const visitMd = async () => {
      const result = await action({
        path: '/adventure/visitMd',
        params: {
          id: currentBlog.id,
        },
      })
    }
    visitMd()
    return () => {
      dispatch(setBlogMd({ currentBlog: ''  }))
    }
  }, [])

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
  }, [])

  console.log('currentBlog',currentBlog)

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs
        style={{
          overflow: 'hidden',
          paddingRight: size.width > 600 ? 0 : 10,
          backdropFilter:'blur(20px)'
        }}
      >
        <Paper
          ref={divRef}
          elevation={4}
          // className="glass"
          style={{
            height: (size?.height || 0) - 40,
            overflowY: 'auto',
            marginRight: isScrollbarVisible ? '-15px' : 0, // Adjust margin based on scrollbar visibility
            scrollbarWidth: isScrollbarVisible ? 'auto' : 'none', // For Firefox
            msOverflowStyle: isScrollbarVisible ? 'auto' : 'none', // For IE and Edge
          }}
          sx={{
            '&::-webkit-scrollbar': {
              display: isScrollbarVisible ? 'auto' : 'none', // For Chrome, Safari, and newer versions of Opera
            }
          }}
        >
          {currentBlog.name == 'deepseek测试' ? <DeepseekChat/> : <div
            className="markdown-body"
            style={{
              padding: 20,
              marginBottom: 20,
              minHeight: 150,
              background: 'transparent',
            }}
            dangerouslySetInnerHTML={{ __html: currentBlog.md }}
          ></div>}
        </Paper>
      </Grid>
    </Grid>
  )
}