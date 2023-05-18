import React, { useEffect } from 'react'
import useResizeObserver from "use-resize-observer";
import useWindowSize from '../../../hooks/useWindowSize';
import background from '@/images/th2.jpeg'
import snow from '@/images/snow.png'

const Height = 300
const pieceLength = 100 // 雪花个数
const pieceMin = 10 // 雪花最小半径
const pieceMax = 50 // 雪花最大半径
const maxVy0 = 3 // 最大下落速度

const snowImage = new Image(45,45)
snowImage.src = snow

const TopBar = () => {
	const canvasRef = React.useRef(null) as any
  const size = useWindowSize();
	useEffect(() => {
		canvasRef.current.style.backgroundImage = `url(${background})`
		if(size.width && size.height){
			const canvasDom = canvasRef.current as unknown as HTMLCanvasElement
			const ctx = canvasDom.getContext('2d') as any
			const createPieces = (pieceMax,pieceMin,ctx,size) => {
				return {
					x:Math.floor(Math.random() * size.width) , 
					y:Math.floor(Math.random() * Height),
					vy:Math.ceil(Math.random() * maxVy0),
					r:Math.random() * (pieceMax - pieceMin) + pieceMin,
					t:Math.random() * 2,
					draw:function() {
						// if(Math.abs(this.x) > size.width){
						// 	this.x = this.x < 0 ? this.x + size.width : this.x - size.width
						// }
						// if(Math.abs(this.y) > Height){
						// 	this.y = this.y - Height
						// }
						ctx.drawImage(snowImage,this.x - this.r/2 * Math.sqrt(2),this.y - this.r/2 * Math.sqrt(2),this.r/2 * Math.sqrt(2),this.r/2 * Math.sqrt(2))
						// const gradient = ctx.createRadialGradient(this.x,this.y,this.r,this.x,this.y,0)
						// gradient.addColorStop(0,"transparent")
						// gradient.addColorStop(1,"white")
						// ctx.fillStyle = gradient;
						// ctx.fillRect(0,0,size.width,Height);
					}
				}
			} 
			const pieces = [] as any
			for(let i = 0 ;i<pieceLength;i++){
				const piece = createPieces(pieceMax,pieceMin,ctx,size)
				piece.draw()
				pieces.push(piece)
			}
			let start;
			const animate = (timestamp) => {
				if (start === undefined) {
					start = timestamp;
				}
				ctx.clearRect(0,0, size.width, Height);
				for(let i = 0 ;i<pieces.length;i++){
					pieces[i].y += pieces[i].vy
					if(pieces[i].y + pieces[i].r > Height){
						pieces[i].y = 0
					}
					if(pieces[i].x + pieces[i].r > size.width){
						pieces[i].x = 0
					}
					pieces[i].x = pieces[i].x + 2 * Math.sin(pieces[i].y/100 * Math.PI * pieces[i].t)
					pieces[i].draw()
				}
				window.requestAnimationFrame(animate)
			}
			// snowImage.onload = () => {
				
			// }
			window.requestAnimationFrame(animate);
		}
	},[size])

	return <canvas width={size.width} height ={Height} ref={canvasRef}></canvas>
}

export default TopBar
