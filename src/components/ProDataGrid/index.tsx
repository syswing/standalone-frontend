import React from 'react'
import { GridRowsProp, DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import action from '../../request/action'
import { Stack,Button } from "@mui/material";
import FormDialog from './FormDialog';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from '@mui/icons-material/Block';


export default (props) => {

  const dialogRef = React.useRef<any>(null)

  const [rows, setRows] = React.useState<GridRowsProp>([])

  const [loading, setLoading] = React.useState(false)

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  })

  const loadServerRows = async (page: number, data: any): Promise<any> => {
    const res = await action({
      path: props.path,
      params: {
        page,
        pageSize: paginationModel.pageSize,
      },
    })

    return res
  }

  React.useEffect(() => {
    let active = true
    refresh(active)
    return () => {
      active = false
    }
  }, [paginationModel.page, props.columns])

  const refresh = async (active) => {
    setLoading(true)
    const newRows = (await loadServerRows(paginationModel.page, props.columns)) as any

    if (!active) {
      return
    }

    setRows(newRows.data)
    setLoading(false)
  }

  const tableAdd = () => {
    console.log('add')
    dialogRef.current.openDialog({
      title:'新增',
      columns:props.columns.filter(item=>item.add),
      path:props.addPath
    })
  }

  const tableActions = () => {
    return {
      field: "actions",
      type: "actions",
      headerName:'操作',
      width: 100,
      getActions: (params) => [
        props.actions.editPath && <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => {
          dialogRef.current.openDialog({
            title:'编辑',
            columns:props.columns.filter(item=>item.edit),
            path:props.actions.editPath,
            params:{
              id:params.row.id
            }
          })
        }}/>,
        props.actions.removePath &&  <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            dialogRef.current.openDialog({
              title:'请确认',
              element:<div>是否删除该路由？</div>,
              path:props.actions.removePath,
              params:{
                id:params.row.id
              }
            })
          }}
        />,
        props.actions.delPath && <GridActionsCellItem 
        icon={<BlockIcon />} 
        label="Block" onClick={() => {
          dialogRef.current.openDialog({
            title:'请确认',
            element:<div>是否封禁该路由？</div>,
            path:props.actions.delPath,
            params:{
              id:params.row.id
            }
          })
        }}/>,
      ],
    }
  }

  const tableColumns = React.useMemo(() => {
    return props.actions ? props.columns.concat(tableActions()) : props.columns
  }, [props.actions, props.columns])


  return (
    <>
      <FormDialog ref={dialogRef} refresh={() => refresh(true)}/>
      <Stack
        style={{ paddingLeft: 20 }}
        direction="row"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Button
          size="small"
          onClick={tableAdd}
        >
          {props?.add?.title || '新增'}
        </Button>
      </Stack>
      <DataGrid
        {...props}
        rows={rows}
        columns={tableColumns}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        loading={loading}
      />
    </>
  )
}
