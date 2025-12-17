import React, { useRef, useState } from 'react'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import TitleIcon from '@mui/icons-material/Title'
import CodeIcon from '@mui/icons-material/Code'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ReplyIcon from '@mui/icons-material/Reply'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Theme, useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useConfirm } from 'material-ui-confirm'
import action from '../../../request/action'

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}

const IconToolTip = (props) => {
  return <a className={props.className}>{props.children}</a>
}

const IconToolTipWarp = styled(IconToolTip)<any>(({ marginLeft }) => {
  return {
    '&:hover': {
      color: '#f2f2f2',
      backgroundColor: '#595959',
    },
    color: '#595959',
    padding: '11px',
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    '& span': {
      fontSize: '13px',
      marginLeft: marginLeft || '8px',
      lineHeight: '17px',
    },
  }
})

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))

const FormDialog = React.forwardRef<any, any>((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [selectData, setSelectData] = React.useState<string[]>([])
  const tags = useSelector((state: any) => state.tagsReducer.tags)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleClose = () => {
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }))

  const openDialog = () => {
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  const handleTagClick = (tagId: string) => {
    setSelectData((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  const handleDelete = (tagId: string) => {
    setSelectData((prev) => prev.filter((id) => id !== tagId))
  }

  const handleConfirm = () => {
    props?.onConfirm(selectData)
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        disableEscapeKeyDown
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          选择标签
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {/* 所有可选标签 */}
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.keys(tags).map((key) => {
                const tag = tags[key]
                const isSelected = selectData.includes(tag.id)
                return (
                  <Chip
                    key={tag.id}
                    label={tag.ch}
                    onClick={() => handleTagClick(tag.id)}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    icon={<LocalOfferIcon />}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 400,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  />
                )
              })}
            </Box>
          </Box>
          {/* 已选择的标签 - 使用 Card 包裹 */}
          {selectData.length > 0 && (
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor:
                  theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(25, 118, 210, 0.3)',
                borderWidth: 2,
              }}
            >
              <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocalOfferIcon
                    sx={{
                      mr: 1,
                      color: 'primary.main',
                      fontSize: 20,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                    }}
                  >
                    已选择的标签
                  </Typography>
                  <Chip
                    label={selectData.length}
                    size="small"
                    color="primary"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectData.map((tagId) => {
                    const tag = tags[tagId]
                    return (
                      <Chip
                        key={tag.id}
                        label={tag.ch}
                        onDelete={() => handleDelete(tagId)}
                        color="primary"
                        icon={<LocalOfferIcon />}
                        sx={{
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: 'inherit',
                            '&:hover': {
                              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                            },
                          },
                        }}
                      />
                    )
                  })}
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={selectData.length === 0}
          >
            确定 {selectData.length > 0 && `(${selectData.length})`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default (props) => {
  const tagModalRef = React.useRef(null) as any
  const [articleTags, setArticleTags] = useState([])
  const tags = useSelector((state: any) => state.tagsReducer.tags)

  const inputRef = useRef<any>(null)

  const editorRef = props.textRef
  const setMdContent = props.setMdContent

  // Move tag parsing inside useEffect to avoid creating new array on every render
  React.useEffect(() => {
    const tagString = props?.tag
    if (tagString) {
      const tagArray = tagString.split(',')
      if (tagArray.length > 0) {
        setArticleTags(tagArray.map((t) => tags[t]).filter((t) => t !== undefined))
      }
    }
  }, [props?.tag, tags]) // Use props.tag directly as dependency

  const confirm = useConfirm()

  const UlStyle = {
    margin: 0,
    listStyleType: 'none',
    backgroundColor: '#d9d9d9',
    borderBottom: '1px solid #ccc',
    fontSize: 0,
    display: 'flex',
    flexFlow: 'row wrap',
    lineHeight: 1,
  }

  const liStyle = {
    display: 'inline-block',
    cursor: 'pointer',
    textAlign: 'center' as any,
  }

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0,
    left: 0,
    white-space: nowrap;
    width: 1px;
  `

  return (
    <>
      <ul style={UlStyle}>
        <BootstrapTooltip
          title="上传图片"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current?.click()
            }
          }}
        >
          <li style={liStyle}>
            <IconToolTipWarp>
              <PhotoSizeSelectActualIcon sx={{ fontSize: 17 }} />
              <VisuallyHiddenInput type="file" />
            </IconToolTipWarp>

            <VisuallyHiddenInput
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files || []
                const res = await action({
                  path: '/picture/upload',
                  params: {
                    file: files[0],
                  },
                })
                const newStr = editorRef.current.value.concat(`![${res.data}](/api/picture/getPic?picName=${res.data})`)
                editorRef.current.value = newStr
                setMdContent(newStr)
              }}
              ref={inputRef}
              type="file"
            />
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip
          title="标题"
          onClick={() => {
            const newStr = editorRef.current.value.concat(`#`)
            editorRef.current.value = newStr
            setMdContent(newStr)
          }}
        >
          <li style={liStyle}>
            <IconToolTipWarp>
              <TitleIcon sx={{ fontSize: 17 }} />
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="代码块">
          <li style={liStyle}>
            <IconToolTipWarp>
              <CodeIcon sx={{ fontSize: 17 }} />
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="标记">
          <li style={liStyle}>
            <IconToolTipWarp>
              <BookmarkIcon sx={{ fontSize: 17 }} />
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="选择标签">
          <li
            style={liStyle}
            onClick={() => {
              tagModalRef.current.openDialog()
            }}
          >
            <IconToolTipWarp>
              <LocalOfferIcon sx={{ fontSize: 17 }} />
              <span>选择标签</span>
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="发布">
          <li
            onClick={() => {
              // 提交
              confirm({
                title: '发布',
                content: (
                  <Box sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalOfferIcon
                        sx={{
                          mr: 1,
                          color: 'primary.main',
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        标签列表
                      </Typography>
                      <Chip
                        label={articleTags.length}
                        size="small"
                        color="primary"
                        sx={{
                          ml: 1,
                          height: 20,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    {articleTags.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {articleTags.map((articleTag: any) => {
                          return (
                            <Chip
                              key={articleTag.en}
                              label={articleTag.ch}
                              color="primary"
                              icon={<LocalOfferIcon />}
                              size="small"
                              sx={{
                                fontWeight: 500,
                              }}
                            />
                          )
                        })}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          py: 2,
                        }}
                      >
                        未选择任何标签
                      </Typography>
                    )}
                  </Box>
                ),
                confirmationText: '确定',
                cancellationText: '取消',
              })
                .then(() => props.onConfirm(articleTags))
                .catch(() => {
                  // 用户点击取消或关闭对话框，不做任何操作
                  console.log('用户取消了发布操作')
                })
            }}
            style={{
              ...liStyle,
              marginLeft: 'auto',
            }}
          >
            <IconToolTipWarp>
              <ReplyIcon sx={{ fontSize: 17 }} />
              <span>发布</span>
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
      </ul>
      <FormDialog
        ref={tagModalRef}
        onConfirm={(selectData) => {
          setArticleTags(selectData.map((item) => tags[item]))
          tagModalRef.current.closeDialog()
        }}
      />
    </>
  )
}
