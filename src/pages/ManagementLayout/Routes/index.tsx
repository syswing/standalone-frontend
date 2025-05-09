import { GridRowsProp, DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ProDataGrid from 'components/ProDataGrid'
const Routes = () => {
  

  const columns = [
    { field: 'id', headerName: '路由ID', width: 100 },
    { field: 'name', headerName: '路由名称', width: 100,add:true,edit: true },
    { field: 'path', headerName: '路由路径', width: 100,add:true,edit: true  },
    { field: 'title', headerName: '路由标题', width: 100,add:true,edit: true  },
    { field: 'description', headerName: '路由描述', width: 100,add:true,edit: true  },
    { field: 'icon', headerName: '路由图标', width: 100,add:true,edit: true  },
    { field: 'parentId', headerName: '父级路由ID', width: 100,add:true },
    { field: 'isActive', headerName: '是否激活', width: 100,add:true },
    { field: 'isDeleted', headerName: '是否删除', width: 100,add:true },
    { field: 'createdAt', headerName: '创建时间', width: 100 },
    { field: 'updatedAt', headerName: '更新时间', width: 100 },
  ]

  return (
    <div>
      <ProDataGrid
        path={'/routes/list'}
        addPath={'/routes/create'}
        actions={{
          removePath: '/routes/remove',
          editPath: '/routes/update',
          delPath:'/routes/delete'
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

export default Routes
