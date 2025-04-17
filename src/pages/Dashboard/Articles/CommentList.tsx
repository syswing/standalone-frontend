export default ({ children,blog }:any) => {
  return (
    <div className="w-full h-full flex justify-center items-center glass">
      {children ? children : <div className="text-2xl text-gray-500">暂无评论</div>}
    </div>
  )
}
