import ProDataGrid from 'components/ProDataGrid'
const Comments = () => {
  

  const columns = [
    { field: 'id', headerName: '评论id', width: 100 },
    { field: 'nickname', headerName: '名称', width: 100 },
    { field: 'content', headerName: '内容', width: 100 },
    // { field: 'content', headerName: '内容', width: 100 },
    { field: 'create_at', headerName: '创建时间', width: 100 },
    { field: 'update_at', headerName: '更新时间', width: 100 },
  ]

  return (
    <div>
      <ProDataGrid
        path={'/comment/list'}
        actions={{
          delPath:'/comment/delete'
        }}
        columns={columns}
        pagination={{
          page:'page',
          pageSize:'size',
        }}
        checkboxSelection
      />
    </div>
  )
}

export default Comments
