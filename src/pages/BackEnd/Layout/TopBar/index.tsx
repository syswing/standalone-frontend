import React, { useEffect } from 'react'
import useResizeObserver from "use-resize-observer";
import useWindowSize from '../../../../hooks/useWindowSize';
import background from '../../../../images/th2.jpeg'

const Height = 300
const pieceLength = 100 // 雪花个数
const pieceMin = 4 // 雪花最小半径
const maxVx0 = 2 // 最大摇摆速度
const pieceMax = 20 // 雪花最大半径
const maxVy0 = 3 // 最大下落速度
const maxa = 0.2// 最大摇摆加速度


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
					vx:Math.ceil(Math.random() ) * maxVx0  * (-1) * (Math.random() < 0.5 ? 1 : -1),
					// maxVx:Math.ceil(Math.random() ) * maxVx0  * (-1) * (Math.random() < 0.5 ? 1 : -1),
					a:function(){
						return (
							// Math.random() *
							maxa *
						  ( this.vx > 0 ? -1 : 1)
						)
							
					},
					t:function() {
						return Math.abs(this.vx / this.a())
					},
					vy:Math.ceil(Math.random() * maxVy0),
					r:Math.random() * (pieceMax - pieceMin) + pieceMin,
					draw:function() {
						const gradient = ctx.createRadialGradient(this.x,this.y,this.r,this.x,this.y,0)
						gradient.addColorStop(0,"transparent")
						gradient.addColorStop(1,"white")
						ctx.fillStyle = gradient;
						ctx.fillRect(0,0,size.width,Height);
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
				const elapsed = timestamp - start;

				ctx.clearRect(0,0, size.width, Height);
				for(let i = 0 ;i<pieces.length;i++){
					pieces[i].x +=pieces[i].vx
					if(pieces[i].y + pieces[i].r > Height){
						pieces[i].y = 0
					}
					// if(pieces[i].x + pieces[i].r > size.width ){
					// 	pieces[i].x = 0
					// }else{
					// 	pieces[i].x = size.width
					// }
					pieces[i].y +=pieces[i].vy 
					pieces[i].x +=pieces[i].vx
					// 和初始方向相同j
					// console.log(timestamp,pieces[i].t(),timestamp / pieces[i].t() % 2)
					// console.log(Math.floor(timestamp / pieces[i].t()))
					if(Math.ceil(elapsed / 1000 / pieces[i].t()) % 2 === 1 ){
						pieces[i].vx += pieces[i].a()
					}else{
						pieces[i].vx -= pieces[i].a()
					}
					
					pieces[i].draw()
				}
				window.requestAnimationFrame(animate)
			}
			window.requestAnimationFrame(animate);
		}
	},[size])

	return <canvas width={size.width} height ={Height} ref={canvasRef}></canvas>
}

export default TopBar
