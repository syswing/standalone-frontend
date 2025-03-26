import React from 'react'
import { GridRowsProp, DataGrid } from '@mui/x-data-grid'
import action from '../../request/action'
import { Stack,Button } from "@mui/material";
import FormDialog from './FormDialog';


export default (props) => {
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
  }

  return (
    <>
      <FormDialog ref="dialogRef"/>
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
        rows={rows}
        columns={props.columns}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        loading={loading}
        {...props}
      />
    </>
  )
}
