import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import styled from '@emotion/styled'
const NavBtnShadow = styled.div(({ theme }) => ({
  boxShadow:
    'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;',
  // filter: 'blur(8px)',
}))
const MatchedLink = ({ path, name }) => {
  // 匹配子路由
  const match = useMatch({
    path: path,
    caseSensitive: false, // 大小写敏感
    end: false, //是否全匹配
  })

  console.log('match', match)

  const notMatchedStyle = 'px-3 py-4 mb-2 glass  transition duration-300 ease-in-out cursor-pointer'

  const matchedStyle = 'px-3 py-4 mb-2 transition hover:bg-gray-100 hover:glass duration-300 ease-in-out shadow-none '

  return (
    <Link to={path}>
      <NavBtnShadow className={match ? notMatchedStyle :  matchedStyle}>
        {name}
      </NavBtnShadow>
    </Link>
  )
}

export default MatchedLink
