// components/videos/VideoCard.jsx
import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Slide } from '@mui/material';
import { Favorite, FavoriteBorder, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';
import { useAppStore } from '../../store/appStore';
import CountUp from 'react-countup';

const VideoCard = ({ video }) => {
  const [hovered, setHovered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const { userDetails } = useAppStore();
  const navigate = useNavigate();

  const decodeProfilePic = (pic) => {
    if (pic && pic.startsWith('https://wezume')) return pic;
    try {
      return atob(pic);
    } catch {
      return pic;
    }
  };

  const hashVideoId = (id) => btoa(id.toString());

  const handleMouseEnter = async () => {
    setHovered(true);
    if (!likesLoaded) {
      try {
        const [likesRes, scoreRes] = await Promise.all([
          axiosInstance.get(`/api/videos/${video.id}/like-count`),
          axiosInstance.get(`/api/totalscore/${video.id}`)
        ]);
        setLikes(likesRes.data);
        setTotalScore(scoreRes.data);
        setLikesLoaded(true);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const endpoint = isLiked ? 'dislike' : 'like';
      await axiosInstance.post(`/api/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`);
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleClick = () => {
    navigate(`/app/video/${hashVideoId(video.id)}`);
  };

  return (
    <Card 
      sx={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', height: 280 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={video.thumbnail}
        alt="Video thumbnail"
        sx={{ objectFit: 'cover' }}
      />
      
      <Slide direction="right" in={hovered && likesLoaded}>
        <Box sx={{ 
          position: 'absolute', 
          top: '35%', 
          left: '10px', 
          transform: 'translateY(-50%)',
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 1,
          borderRadius: 1,
          height: { xs: 35, md: 40 },
          minWidth: { xs: 70, md: 80 },
          fontSize: { xs: '0.8rem', md: '1rem' }
        }}>
          <IconButton 
            size="small" 
            onClick={handleLike} 
            sx={{ 
              color: 'white',
              minWidth: { xs: 20, md: 24 },
              p: { xs: 0.5, md: 1 }
            }}
          >
            {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          <CountUp end={likes} duration={1} style={{ fontSize: 'inherit' }} />
        </Box>
      </Slide>

      <Slide direction="left" in={hovered && totalScore}>
        <Box sx={{ 
          position: 'absolute', 
          top: '35%', 
          right: '10px',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 1,
          borderRadius: 1,
          height: { xs: 35, md: 40 },
          minWidth: { xs: 70, md: 80 },
          gap: 0.5,
          fontSize: { xs: '0.8rem', md: '1rem' }
        }}>
          <Assessment fontSize="small" />
          <span style={{ fontSize: 'inherit' }}>
            {totalScore?.totalScore?.toFixed(1) || 'N/A'}
          </span>
        </Box>
      </Slide>

      <CardContent sx={{ display: 'flex', alignItems: 'center', height: 80, p: { xs: 1, md: 2 } }}>
        <img 
          src={decodeProfilePic(video.profilepic)} 
          alt="Profile"
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            marginRight: 8,
            objectFit: 'cover'
          }}
        />
        <Typography 
          variant="subtitle1" 
          noWrap
          sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          {video.firstname}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;