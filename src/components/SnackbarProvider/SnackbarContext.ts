import React from 'react'
import { SnackbarContextType } from './useSnackbar'

const SnackbarContext = React.createContext<SnackbarContextType | null>(null)

export default SnackbarContext