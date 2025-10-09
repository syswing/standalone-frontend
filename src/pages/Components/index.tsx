import React, { useEffect } from 'react'
import { SVG } from '@svgdotjs/svg.js'

export default () => {
  useEffect(() => {
    // 创建 SVG 画布
    const svg = SVG().addTo('#flag-container').size(400, 300)
    
    // // 绘制红色背景
    // svg.rect(400, 300).fill('#DE2910')
    
    // // 绘制大五角星
    // const bigStar = svg.polygon('50,20 61.8,46.2 90,46.2 68.2,62.8 79,89 50,72.4 21,89 31.8,62.8 10,46.2 38.2,46.2')
    //   .fill('#FFDE00')
    //   .move(60, 40)
    
    // // 绘制四个小五角星
    // const smallStarPoints = '10,4 12.4,9.2 18,9.2 13.6,12.4 15.6,17.6 10,14.8 4.4,17.6 6.4,12.4 2,9.2 7.6,9.2'
    
    // // 第一个小星
    // const star1 = svg.polygon(smallStarPoints)
    //   .fill('#FFDE00')
    //   .move(160, 50)
    //   .rotate(23)
    
    // // 第二个小星
    // const star2 = svg.polygon(smallStarPoints)
    //   .fill('#FFDE00')
    //   .move(180, 80)
    //   .rotate(46)
    
    // // 第三个小星
    // const star3 = svg.polygon(smallStarPoints)
    //   .fill('#FFDE00')
    //   .move(180, 120)
    //   .rotate(70)
    
    // // 第四个小星
    // const star4 = svg.polygon(smallStarPoints)
    //   .fill('#FFDE00')
    //   .move(160, 150)
    //   .rotate(23)
    
    // 添加边框
    svg.rect(400, 300).fill('none').stroke({ color: '#000', width: 2 })
    
    // 添加标题
  

    return () => {
      svg.remove()
    }
  }, [])

  return (
    <>
      <div style={{ margin: '20px 0' }}>
        <div id="flag-container" style={{ border: '1px solid #ccc', display: 'inline-block' }}></div>
      </div>
    </>
  )
}