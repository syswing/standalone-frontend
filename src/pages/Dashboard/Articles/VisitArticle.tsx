import { IconButton, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
export default ({visit}) => {

	return <>
		<IconButton>
      <VisibilityIcon />
		</IconButton>
		<Typography>{visit}</Typography>
	</>
}

