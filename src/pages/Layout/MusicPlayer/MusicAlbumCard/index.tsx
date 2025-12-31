import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(1),
}));
const isDev = process.env.NODE_ENV === 'development'

const MusicAlbumCard = ({ album }) => {
  return (
    <StyledCard>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={album.coverUrl
            ? (isDev ? 'http://localhost:7777/api' : 'https://syswing.icu/api') + album.coverUrl
            : ''} // Replace with the actual album cover URL
          alt={album.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {album.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {album.artist}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {album.releaseYear}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default MusicAlbumCard;