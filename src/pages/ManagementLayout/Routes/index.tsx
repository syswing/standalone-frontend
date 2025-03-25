import { GridRowsProp, DataGrid } from '@mui/x-data-grid'
import React from 'react'
import action from '../../../request/action'

const Routes = () => {
  const [rows, setRows] = React.useState<GridRowsProp>([])

  const columns = React.useMemo(() => {
    return [
      { field: 'id', headerName: '路由ID', width: 100 },
      { field: 'name', headerName: '路由名称', width: 100 },
      { field: 'path', headerName: '路由路径', width: 100 },
      { field: 'title', headerName: '路由标题', width: 100 },
      { field: 'description', headerName: '路由描述', width: 100 },
      { field: 'icon', headerName: '路由图标', width: 100 },
      { field: 'parentId', headerName: '父级路由ID', width: 100 },
      { field: 'isActive', headerName: '是否激活', width: 100 },
      { field: 'isDeleted', headerName: '是否删除', width: 100 },
      { field: 'createdAt', headerName: '创建时间', width: 100 },
      { field: 'updatedAt', headerName: '更新时间', width: 100 },

    ]
  }, [])

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const loadServerRows = async (page: number, data: any): Promise<any> => {
    const res = await action({
      path: '/routes',
      params: {
        page,
        pageSize: paginationModel.pageSize,
      },
    })
    
    return res
  }
  


  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
      />
    </div>
  )
}

export default Routes
