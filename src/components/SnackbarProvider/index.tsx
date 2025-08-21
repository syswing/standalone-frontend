import React, { useState, ReactNode } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'
import SnackbarContext from './SnackbarContext'
import { SnackbarSeverity } from './useSnackbar'

interface SnackbarProviderProps {
  children: ReactNode
  defaultDuration?: number
}

const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ 
  children, 
  defaultDuration = 6000 
}) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<SnackbarSeverity>('info')
  const [duration, setDuration] = useState(defaultDuration)

  const showSnackbar = (
    message: string, 
    severity: SnackbarSeverity = 'info', 
    duration: number = defaultDuration
  ) => {
    setMessage(message)
    setSeverity(severity)
    setDuration(duration)
    setOpen(true)
  }

  const closeSnackbar = () => {
    setOpen(false)
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    closeSnackbar()
  }

  const contextValue = {
    showSnackbar,
    closeSnackbar,
    isOpen: open, 
    message,
    severity
  }

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity as AlertColor} 
          sx={{ width: '100%' }}
          variant="filled"
          elevation={6}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider
