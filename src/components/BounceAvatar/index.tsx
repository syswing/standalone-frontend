import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import shadows from '@mui/material/styles/shadows'
import { Avatar } from '@mui/material'

const bounceOut = keyframes`
	0%{ box-shadow: ${shadows[2]}; transform: scale(1.1, 1.1);}
	25%{ box-shadow: ${shadows[3]}; transform: scale(0.9, 0.9);}
	50%{ box-shadow: ${shadows[4]}; transform: scale(1.2, 1.2); }
	75%{ box-shadow: ${shadows[5]}; transform: scale(1.1, 1.1);}
	100%{ box-shadow:${shadows[3]}; transform: scale(1, 1);}
`
const BounceAvatar = styled(Avatar)<any>(() => {
  return {
    '&:hover': {
      animation: `${bounceOut} .8s linear`,
    },
  }
})

export default BounceAvatar
