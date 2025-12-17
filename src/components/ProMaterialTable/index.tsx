import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material'
import React from 'react'
import action from '../../request/action'
import FormDialog from 'components/ProDataGrid/FormDialog'
import { zhCN } from '@mui/material/locale'
import { createTheme, ThemeProvider } from '@mui/material/styles'

interface Columns {
  field: string
  headerName: string
  width: number
  renderCell?: (params: any) => React.ReactNode
}

interface Pagination {
  paginationPage: string
  paginationPagePageSize: string
}

interface Actions {
  delPath?: string
  editPath?: string
}

export default (props: {
  columns: Columns[]
  path: string
  pagination: Pagination
  actions?: Actions
  extraActions?: (params: any, dialogRef: any) => React.ReactNode
}) => {
const parentTheme = useTheme()
 const theme = React.useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: parentTheme.palette.mode,
            primary: { main: '#1976d2' },
            ...(parentTheme.palette.mode === 'dark' && {
              background: {
                paper: '#1e1e1e',
                default: '#121212',
              },
            }),
          },
        },
        zhCN,
      ),
    [parentTheme.palette.mode],
  )
  const { columns } = props

  const [rows, setRows] = React.useState([])

  const [total, setTotal] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  const { paginationPage = 'page', paginationPagePageSize = 'size' } = props.pagination

  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 5,
  })

  const dialogRef = React.useRef<any>(null)

  // 使用 useMemo 来稳定 columns 的引用
  const stableColumns = React.useMemo(() => {
    const operations = {
      field: 'actions',
      headerName: '操作',
      width: 150,
      renderCell: (params) => {
        return (
          <TableCell
            key="actions"
            component="th"
            scope="row"
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {props.actions?.delPath && (
                <Button
                  variant="text"
                  onClick={() => {
                    dialogRef.current.openDialog({
                      title: '请确认', 
                      element: <div>是否删除？</div>,
                      path: props.actions?.delPath,
                      params: { id: params.id },
                    })
                  }}
                >
                  删除
                </Button>
              )}
              {props.actions?.editPath && (
                <Button
                  variant="text"
                  onClick={() => {
                    // window.location.href = `${props.actions?.editPath}/${params.row.id}`
                  }}
                >
                  编辑
                </Button>
              )}
              {props.extraActions?.(params, dialogRef)}
            </Box>
          </TableCell>
        )
      },
    }
    if (props.actions) {
      return [...columns, operations]
    }
    return columns
  }, [JSON.stringify(columns)])

  const loadServerRows = async (page: number, data: any): Promise<any> => {
    const res = await action({
      path: props.path,
      params: {
        [paginationPage]: page,
        [paginationPagePageSize]: paginationModel.pageSize,
      },
    })

    return res
  }

  const refresh = React.useCallback(
    async (active) => {
      setLoading(true)
      const newRows = (await loadServerRows(paginationModel.page, paginationModel.pageSize)) as any

      if (!active) {
        return
      }
      setTotal(newRows.total)
      setRows(newRows.data)
      setLoading(false)
    },
    [paginationModel.page, paginationModel.pageSize, props.path],
  )

  React.useEffect(() => {
    let active = true
    refresh(active)
    return () => {
      active = false
    }
  }, [paginationModel.page, paginationModel.pageSize, refresh])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage + 1 }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChangeRowsPerPage', parseInt(event.target.value, 10))
    setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10), page: 1 }))
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
        <FormDialog
          ref={dialogRef}
          refresh={() => refresh(true)}
        />
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {stableColumns.map((column) => (
                  <TableCell
                    key={column.field}
                    width={column.width}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {loading && (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={stableColumns.length}
                    sx={{ padding: 0, border: 0 }}
                  >
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={`row-${index}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      component="th"
                      scope="row"
                    >
                      {column.renderCell ? column.renderCell(row) : row[column.field]}
                    </TableCell>
                  ))}

                  {props.actions && stableColumns.find((col) => col.field === 'actions')?.renderCell?.(row)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={paginationModel.pageSize}
          page={paginationModel.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </ThemeProvider>
  )
}
