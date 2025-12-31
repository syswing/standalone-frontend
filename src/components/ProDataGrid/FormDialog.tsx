import React, { useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import LoadingConfirmBtn from 'components/LoadingConfirmBtn'
import action from 'request/action'
import { SubmitHandler, useForm } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'
import { VisuallyHiddenInput } from 'components/StyledComponent'

const FormDialog = React.forwardRef((props: any, ref) => {
  const [dialogParams, setDialogParams] = React.useState<any>(null)
  const [modalLoading, setModalLoading] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>()

  React.useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }))

  const openDialog = (params) => {
    setDialogParams(params)

    // If we have initial values in params, set them in the form
    if (params?.initialValues) {
      Object.keys(params.initialValues).forEach((key) => {
        setValue(key, params.initialValues[key])
      })
    } else {
      // Reset form when opening without initial values
      reset()
    }
  }

  const closeDialog = () => {
    reset() // Reset form when closing
    setDialogParams(null)
  }

  // Handle simple confirmation dialogs without forms
  const handleConfirm = async () => {
    if (!dialogParams?.path) return

    setModalLoading(true)
    try {
      await action({
        path: dialogParams.path,
        params: dialogParams.params || {},
      })
      closeDialog()
      props?.refresh?.()
    } catch (error) {
      console.error(error)
    } finally {
      setModalLoading(false)
    }
  }

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!dialogParams?.path) return

    setModalLoading(true)
    try {
      // Process params to convert string booleans to actual booleans
      const processedParams = { ...(dialogParams?.params || {}),...data }

      // Convert string 'true'/'false' to boolean for specific fields
      Object.keys(processedParams).forEach((key) => {
        if (processedParams[key] === 'true') {
          processedParams[key] = true
        } else if (processedParams[key] === 'false') {
          processedParams[key] = false
        }
      })

      props?.beforeSubmit && props.beforeSubmit(processedParams);

      await action({
        path: dialogParams.path,
        params: processedParams,
      })
      closeDialog()
      props?.refresh?.()
    } catch (error) {
      console.error(error)
    } finally {
      setModalLoading(false)
    }
  }

  // Determine if this is a form dialog or just a confirmation dialog
  const isFormDialog = dialogParams?.columns && dialogParams.columns.length > 0

  return (
    <Dialog
      sx={{ m: 0, p: 2 }}
      open={!!dialogParams}
      onClose={() => !modalLoading && closeDialog()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{dialogParams?.title || '--'}</DialogTitle>

      {isFormDialog ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            {dialogParams?.columns?.map((item) => (
              <TextField
                key={item.field}
                {...register(item.field)}
                autoFocus={item.autoFocus}
                margin="dense"
                id={item.field}
                label={item.headerName}
                fullWidth
                variant="standard"
                type={item.type || 'text'}
                error={!!errors[item.field]}
                helperText={errors[item.field]?.message?.toString()}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ))}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closeDialog}
              disabled={modalLoading}
            >
              取消
            </Button>
            <LoadingButton
              loading={modalLoading}
              component="label"
              variant="contained"
              color="primary"
            >
              确定
              <VisuallyHiddenInput type="submit" />
            </LoadingButton>
          </DialogActions>
        </form>
      ) : (
        <>
          <DialogContent dividers>{dialogParams?.element || ''}</DialogContent>

          <DialogActions>
            <Button
              onClick={closeDialog}
              disabled={modalLoading}
            >
              取消
            </Button>
            <LoadingButton
              loading={modalLoading}
              onClick={handleConfirm}
              variant="contained"
              color="primary"
            >
              确定
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
})

export default FormDialog
