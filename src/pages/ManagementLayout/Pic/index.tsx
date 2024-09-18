import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import action from '../../../request/action';
import { useRequest } from 'ahooks';

export default () => {

  const { data, error, loading } = useRequest(async () => {
    const result = await action({
      path: "/picture/getPicPage",
      params:{
        page:1,
        size:10
      }
    });
    return result 
  });

  console.log('data',data)

	return <Box sx={{ paddingLeft:20,paddingRight:20,overflowY: 'scroll' }}>
  	<ImageList variant="masonry" cols={3} gap={20}>
  		{data?.data.map((item) => (
  			<ImageListItem key={item.id}>
  				<img
  					src={`/api/picture/getPic?picName=${item.name}`}
  					alt={item.description}
  					loading="lazy"
  				/>
  			</ImageListItem>
  		))}
  	</ImageList>
  </Box>
}
