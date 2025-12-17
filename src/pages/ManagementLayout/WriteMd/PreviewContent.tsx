import React, { useEffect, useState } from 'react'
import * as MarkdownIt from 'markdown-it'
import { useTheme } from '@mui/material'

const markdownIt = new MarkdownIt()

export default ({ mdContent }) => {
  const parentTheme = useTheme()
  const isDarkMode = parentTheme.palette.mode === 'dark'

  // 动态加载对应的 CSS
  useEffect(() => {
    // 移除之前的样式
    const existingStyle = document.getElementById('markdown-theme-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    // 创建新的 style 标签
    const link = document.createElement('link')
    link.id = 'markdown-theme-style'
    link.rel = 'stylesheet'
    link.href = isDarkMode 
      ? require('github-markdown-css/github-markdown-dark.css')
      : require('github-markdown-css/github-markdown-light.css')
    
    document.head.appendChild(link)

    // 清理函数
    return () => {
      const styleToRemove = document.getElementById('markdown-theme-style')
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [isDarkMode])

  const html = markdownIt.render(mdContent)

  return (
    <div
      className="markdown-body"
      style={{
        backgroundColor: 'transparent',
        color: isDarkMode ? '#c9d1d9' : '#24292f',
        padding: '16px',
        borderRadius: '8px',
      }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
