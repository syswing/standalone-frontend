import React, { useEffect } from 'react'
import useResizeObserver from 'use-resize-observer'
import useWindowSize from '../../../hooks/useWindowSize'
import background from '@/images/th2.jpeg'
import snow from '@/images/snow.png'
import { useSelector } from 'react-redux'

// const Height = 350
const pieceLength = 100 // 雪花个数
const pieceMin = 10 // 雪花最小半径
const pieceMax = 50 // 雪花最大半径
const maxVy0 = 1 // 最大下落速度

const snowImage = new Image(45, 45)
snowImage.src = snow

let framHandler = 0
let pieces = [] as any

const TopBar = ({ drawSwitch }) => {
  const canvasRef = React.useRef(null) as any
  const size = useWindowSize()

  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)
  const bingUrl = useSelector((state: any) => state.bingPicSliceReducer.bingUrl)
  const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)

  console.log('currentPic', currentPic)

  // const Height = 1080 * (size.width || 0) / 1920

  useEffect(() => {
    
    canvasRef.current.style.backgroundImage = `url(${bingUrl + bingPic.images[currentPic].url})`
    canvasRef.current.style.backgroundSize = `cover`
    canvasRef.current.style.backgroundPosition = 'center'
    canvasRef.current.style.height = '100vh'
    canvasRef.current.style.width = '100%'
    canvasRef.current.style.position = 'fixed'
    canvasRef.current.style.opacity = '0.5'
  }, [currentPic])

  useEffect(() => {
    canvasRef.current.style.backgroundImage = `url(${bingUrl + bingPic.images[currentPic].url})`
    const canvasDom = canvasRef.current as unknown as HTMLCanvasElement
    const ctx = canvasDom?.getContext('2d') as any
    const createPieces = (pieceMax, pieceMin, ctx, size) => {
      return {
        x: Math.floor(Math.random() * size.width),
        y: Math.floor(Math.random() * size.height),
        vy: Math.ceil(Math.random() * maxVy0),
        r: Math.random() * (pieceMax - pieceMin) + pieceMin,
        t: Math.random() * 2,
        draw: function () {
          ctx.drawImage(
            snowImage,
            this.x - (this.r / 2) * Math.sqrt(2),
            this.y - (this.r / 2) * Math.sqrt(2),
            (this.r / 2) * Math.sqrt(2),
            (this.r / 2) * Math.sqrt(2),
          )
        },
      }
    }
    const animate = (timestamp) => {
      ctx.clearRect(0, 0, size.width, size.height)
      for (let i = 0; i < pieces.length; i++) {
        pieces[i].y += pieces[i].vy
        if (pieces[i].y + pieces[i].r > size.height) {
          pieces[i].y = 0
        }
        if (pieces[i].x + pieces[i].r > size.width) {
          pieces[i].x = 0
        }
        pieces[i].x = pieces[i].x + 2 * Math.sin((pieces[i].y / 100) * Math.PI * pieces[i].t)
        pieces[i].draw()
      }
      framHandler = window.requestAnimationFrame(animate)
    }
    if (size.width) {
      for (let i = 0; i < pieceLength; i++) {
        const piece = createPieces(pieceMax, pieceMin, ctx, size)
        piece.draw()
        pieces.push(piece)
      }
      // 开关
      if (drawSwitch) {
        framHandler = window.requestAnimationFrame(animate)
      } else {
        window.cancelAnimationFrame(framHandler)
        ctx.clearRect(0, 0, size.width, size.height)
      }
    }
   
    return () => {
      pieces.length = 0
      window.cancelAnimationFrame(framHandler)
      framHandler = 0
    }
  }, [size, drawSwitch])

  return <canvas width={size.width} height={size.height} ref={canvasRef}></canvas>
}

export default TopBar
