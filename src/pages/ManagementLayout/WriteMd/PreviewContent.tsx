import React, { useEffect, useState } from 'react'
import * as MarkdownIt from 'markdown-it'
// import 'github-markdown-css/github-markdown.css'
import 'github-markdown-css/github-markdown-light.css';
// import 'github-markdown-css/github-markdown-dark.css';
const markdownIt = new MarkdownIt()

export default ({ mdContent }) => {
//   const [isDarkTheme, setIsDarkTheme] = useState(false)

//   const darkTheme = require('github-markdown-css/github-markdown-dark.css')
//   const lightTheme = require('github-markdown-css/github-markdown-light.css')

//   console.log('link.href', darkTheme, lightTheme)

//   useEffect(() => {
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.id = 'theme-stylesheet'
//     link.href = isDarkTheme ? darkTheme : lightTheme
//     document.head.appendChild(link)

//     return () => {
//       const existingLink = document.getElementById('theme-stylesheet')
//       if (existingLink) {
//         existingLink.remove()
//       }
//     }
//   }, [isDarkTheme])

  const html = markdownIt.render(mdContent)

  return (
    <>
      {/* <button
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="px-4 py-2 border rounded"
      >
        切换主题
      </button> */}
      <div
        className={`markdown-body`}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </>
  )
}
