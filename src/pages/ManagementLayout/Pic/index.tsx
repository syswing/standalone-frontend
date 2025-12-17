import * as React from 'react'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import action from '../../../request/action'
import { useRequest } from 'ahooks'
import useWindowSize from 'hooks/useWindowSize'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import ProMaterialTable from 'components/ProMaterialTable'

export default () => {
  const size = useWindowSize()
  const [open, setOpen] = React.useState(false)

  const [selectedPic, setSelectedPic] = React.useState<any>(null)

  const { data, error, loading } = useRequest(async () => {
    const result = await action({
      path: '/picture/getPicPage',
      params: {
        page: 1,
        size: 9999,
      },
    })
    return result
  })

  const { data: adventureList } = useRequest(async () => {
    const result = await action({
      path: '/adventure/adminList',
      params: {
        page: 1,
        size: 9999,
      },
    })
    return result
  })

  console.log('adventureList', adventureList)

  const handleOpen = (item) => {
    setSelectedPic(item)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedPic(null)
    setOpen(false)
  }

  const handleChange = (e) => {
    setSelectedPic({ ...selectedPic, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    // 调用 API 保存图片信息
    await action({
      path: '/picture/update',
      params: {
        id: selectedPic.id,
        description: selectedPic.description,
        adventure_id: selectedPic.adventure_id,
      },
    })
    handleClose()
  }

  console.log('data', data)

  return (
    <Box sx={{ height: size.height, overflowY: 'scroll' }}>
      <ProMaterialTable
        columns={[
          { field: 'name', headerName: '图片名称', width: 120 },
          { field: 'description', headerName: '描述', width: 120 },
          { field: 'adventure_id', headerName: '冒险ID', width: 120 },
          { field: 'path', headerName: '文件路径', width: 250 },
        ]}
        path="/picture/getPicPage"
        pagination={{
          paginationPage: 'page',
          paginationPagePageSize: 'size',
        }}
        actions={{
          delPath: '/picture/deletePic',
        }}
        extraActions={(params) => {
          return [ 
            <Button
              key="extra_edit"
              variant="text"
              onClick={() => {
                handleOpen(params)
              }}
            >
              编辑
            </Button>
          ]
        }}
      />

      {/* <ImageList
        variant="masonry"
        cols={3}
        gap={20}
      >
        {data?.data.map((item) => (
          <ImageListItem
            key={item.id}
            onClick={() => handleOpen(item)}
          >
            <img
              src={`/api/picture/getPic?picName=${item.name}`}
              alt={item.description}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList> */}

      {/* Dialog for editing picture */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>编辑图片信息</DialogTitle>
        <DialogContent>
          {selectedPic && (
            <>
              <img
                src={`/api/picture/getPic?picName=${selectedPic.name}`}
                alt={selectedPic.description}
                style={{ width: '100%', marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="图片描述"
                name="description"
                value={selectedPic.description || ''}
                onChange={handleChange}
                margin="normal"
              />
              <FormControl fullWidth>
                <Select
                  labelId="log-select-label"
                  name="adventure_id"
                  value={selectedPic.adventure_id || ''}
                  onChange={handleChange}
                >
                  {adventureList &&
                    adventureList?.data?.map((log) => (
                      <MenuItem
                        key={log.id}
                        value={log.id}
                      >
                        {log.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
