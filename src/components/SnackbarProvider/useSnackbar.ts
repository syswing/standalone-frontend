import React from 'react'
import SnackbarContext from './SnackbarContext'

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarContextType {
  showSnackbar: (message: string, severity?: SnackbarSeverity, duration?: number) => void
  closeSnackbar: () => void
  isOpen: boolean
  message: string
  severity: SnackbarSeverity
}

export default function useSnackbar(): SnackbarContextType {
  const context = React.useContext(SnackbarContext)
  
  if (context === null) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  
  return context as SnackbarContextType
}