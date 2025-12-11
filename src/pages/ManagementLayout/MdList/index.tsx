import React, { useEffect } from 'react'
import { GridActionsCellItem, DataGrid, GridRowsProp, GridRenderCellParams } from '@mui/x-data-grid'
import action from '../../../request/action'
import { useSelector } from 'react-redux'
import ArticleTags from '../../../components/ArticleTags'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import LoadingConfirmBtn from '../../../components/LoadingConfirmBtn'
import { Slide, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { TransitionProps } from '@mui/material/transitions'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'
import ProDataGrid from 'components/ProDataGrid'

const MdList = () => {
  const tags = useSelector((state: any) => state.tagsReducer.tags)

  const navigate = useNavigate()

  const columns = [
    { field: 'id', headerName: '日志id', width: 100 },
    { field: 'name', headerName: '日志名', width: 100 },
    { field: 'isPublish', headerName: '是否发布', width: 100 },
    { field: 'visit', headerName: '访问次数', width: 100 },
    { field: 'main_pic_id', headerName: '图片id', width: 100 },
    { field: 'create_at', headerName: '创建时间', width: 100 },
    { field: 'update_at', headerName: '更新时间', width: 100 },
  ]

  return (
    <>
      <Stack
        style={{ paddingLeft: 20 }}
        direction="row"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Button
          size="small"
          onClick={() => {
            navigate('/management/writeMd')
          }}
        >
          新建日志
        </Button>
      </Stack>

      <ProDataGrid
        path={'/adventure/adminList'}
        actions={{
          delPath: '/adventure/delete',
        }}
        columns={columns}
        pagination={{
          page: 'page',
          pageSize: 'size',
        }}
        extraActions={(params,dialogRef) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="编辑"
              onClick={() => {
                navigate('/management/writeMd', {
                  state: {
                    id: params.row.id,
                    name: params.row.name,
                    tag: params.row.tag,
                    content: params.row.content,
                  },
                })
              }}
            />,
            <GridActionsCellItem
              icon={<VerticalAlignBottomIcon />}
              label="发布"
              onClick={() => { 
                dialogRef.current.openDialog({
                  title: '请确认',
                  element: <div>确定要{params.row.isPublish ? '下架':'发布'}？</div>,
                  path: `/adventure/${  params.row.isPublish ? 'unpublish' : 'publish'}`,
                  params: { id: params.row.id },
                })
              }}
            />,
          ]
        }}
        checkboxSelection
      />
    </>
  )
}

export default MdList
