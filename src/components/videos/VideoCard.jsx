import { useState } from 'react';
import { Card, CardMedia, Box, IconButton, Slide, Typography } from '@mui/material';
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
      sx={{ 
        cursor: 'pointer', 
        position: 'relative', 
        overflow: 'hidden', 
        height: { xs: 200, lg: 480 },
        borderRadius: 2,
        width: '100%',
        '&:hover .overlay': {
          opacity: 0.6
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
        <CardMedia
          component="img"
          height="100%"
          image={video.thumbnail}
          alt="Video thumbnail"
          sx={{ 
            objectFit: 'cover', 
            width: '100%', 
            height: '100%',
            display: 'block'
          }}
        />

        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1
          }}
        />
        
        <Slide direction="right" in={hovered && likesLoaded} mountOnEnter unmountOnExit>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-200%, -50%)',
            display: 'flex', 
            alignItems: 'center',
            color: 'white',
            px: { xs: 1, md: 1.5 },
            py: 0.5,
            borderRadius: 2,
            minWidth: { xs: 60, md: 70 },
            height: { xs: 32, md: 36 },
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            zIndex: 2,
            gap: 0.5
          }}>
            <IconButton 
              size="small" 
              onClick={handleLike} 
              sx={{ 
                color: 'white',
                p: 0.25,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {isLiked ? <Favorite sx={{ fontSize: 16 }} /> : <FavoriteBorder sx={{ fontSize: 16 }} />}
            </IconButton>
            <CountUp end={likes} duration={1} style={{ fontSize: 'inherit' }} />
          </Box>
        </Slide>

        <Slide direction="left" in={hovered && totalScore} mountOnEnter unmountOnExit>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            right: '50%',
            transform: 'translate(200%, -50%)',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            px: { xs: 1, md: 1.5 },
            py: 0.5,
            borderRadius: 2,
            minWidth: { xs: 60, md: 70 },
            height: { xs: 32, md: 36 },
            gap: 0.5,
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            zIndex: 2
          }}>
            <Assessment sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: 'inherit', lineHeight: 1 }}>
              {totalScore?.totalScore?.toFixed(1) || 'N/A'}
            </Typography>
          </Box>
        </Slide>
      </Box>
    </Card>
  );
};

export default VideoCard;