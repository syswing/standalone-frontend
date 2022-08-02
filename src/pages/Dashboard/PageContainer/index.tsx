import React from 'react'
import { Box,Paper } from '@mui/material'

const PageContainer = ({element}) => {
	return <Box>
		<Paper sx={{
			padding:'20px'
		}} elevation={3}>
			{element}
			{/* {'markdown Content'} */}
		</Paper>
	</Box>
}

export default PageContainer
