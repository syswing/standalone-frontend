import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import LoadingConfirmBtn from 'components/LoadingConfirmBtn'
import action from 'request/action'
import { SubmitHandler, useForm } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'
import { VisuallyHiddenInput } from 'components/StyledComponent'

const FormDialog = React.forwardRef((props: any, ref) => {
  const [dialogParams, setDialogParams] = React.useState<any>(null)
  const [modalLoading, setModalLoading] = React.useState<boolean>(false)

  React.useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }))

  const openDialog = (params) => {
    setDialogParams(params)
  }

  const closeDialog = () => {
    setDialogParams(null)
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>()

  const onSubmit: SubmitHandler<any> = async (data) => {
    setModalLoading(true)
    try {
      console.log('data', data, dialogParams)
      await action({
        path: dialogParams?.path,
        params: {
          ...data,
          ...dialogParams?.params,
        } ,
      })
      closeDialog()
      props?.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setModalLoading(false)
    }
  }

  return (
    <Dialog
      sx={{ m: 0, p: 2 }}
      open={!!dialogParams}
    >
      <DialogTitle>{dialogParams?.title || '--'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {dialogParams?.columns?.map((item) => {
            return (
              <TextField
                key={item.field}
                {...register(item.field)}
                autoFocus
                margin="dense"
                id={item.field}
                label={item.headerName}
                fullWidth
                variant="standard"
              />
            )
          }) || dialogParams?.element ||''}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDialogParams(null)
            }}
          >
            关闭
          </Button>
          <LoadingButton
            loading={modalLoading}
            component="label"
            variant="contained"
          >
            确定
            <VisuallyHiddenInput type="submit" />
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
})

export default FormDialog
