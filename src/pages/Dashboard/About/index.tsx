import React from 'react'

import AvatarImg from '@/images/WechatIMG115.jpeg'
import { useSelector } from 'react-redux'
import Quote from '../../../components/Quote'
import BounceAvatar from '../../../components/BounceAvatar'
import { Card } from '@mui/material'

const About = () => {
  const bingPic = useSelector((state: any) => state.bingPicSliceReducer.bingPic)
  const currentPic = useSelector((state: any) => state.bingPicSliceReducer.current)

  return (
    <div>
      <Card className="p-10" sx={{ maxWidth: 345 }}>
        <BounceAvatar sx={{ width: 88, height: 88 }} alt="syswing" src={AvatarImg} />
        <Quote>{bingPic.images[currentPic]?.copyright}</Quote>
        <Quote float="right">----@bing {bingPic.images[currentPic]?.title}</Quote>
      </Card>
    </div>
  )
}

export default About
