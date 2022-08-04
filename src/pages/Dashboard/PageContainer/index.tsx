import React from 'react'
import { Box,Paper } from '@mui/material'

const PageContainer = ({element}) => {
	return <Box>
		<Paper elevation={4}>
			{element}
		</Paper>
	</Box>
}

export default PageContainer
