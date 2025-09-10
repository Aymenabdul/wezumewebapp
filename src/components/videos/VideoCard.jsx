/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Card, CardMedia, Box, IconButton, Slide, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';
import { useAppStore } from '../../store/appStore';
import CountUp from 'react-countup';

export default function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const [userLikedVideos, setUserLikedVideos] = useState({});
  const { userDetails } = useAppStore();
  const navigate = useNavigate();

  const hashVideoId = (id) => btoa(id.toString());

  useEffect(() => {
    const fetchUserLikedVideos = async () => {
      try {
        const response = await axiosInstance.get(`/videos/likes/status?userId=${userDetails.userId}`);
        const likedVideosMap = {};
        Object.entries(response.data).forEach(([videoId, liked]) => {
          likedVideosMap[videoId] = liked;
        });
        setUserLikedVideos(likedVideosMap);
        
        setIsLiked(likedVideosMap[video.id] || false);
      } catch (error) {
        console.error('Error fetching user liked videos:', error);
      }
    };

    if (userDetails?.userId) {
      fetchUserLikedVideos();
    }
  }, [userDetails.userId, video.id]);

  const handleMouseEnter = async () => {
    setHovered(true);
    if (!likesLoaded) {
      try {
        const [likesRes, scoreRes] = await Promise.all([
          axiosInstance.get(`/videos/${video.id}/like-count`),
          axiosInstance.get(`/totalscore/${video.id}`)
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
      await axiosInstance.post(`/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`);
      
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      
      setUserLikedVideos(prev => ({
        ...prev,
        [video.id]: newLikedState
      }));
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
        height: { xs: 200, md: 500 },
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
            transform: { xs: 'translate(-120%, -50%)', lg: 'translate(-200%, -50%)' },
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            zIndex: 2,
            gap: 1
          }}>
            <Box sx={{
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              borderRadius: '50%',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <IconButton 
                onClick={handleLike} 
                sx={{ 
                  color: isLiked ? '#ff1744' : 'white', 
                  p: 0,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {isLiked ? <Favorite sx={{ fontSize: { xs: 20, md: 24 } }} /> : <FavoriteBorder sx={{ fontSize: { xs: 20, md: 24 } }} />}
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ 
              fontSize: { xs: '0.75rem', md: '0.85rem' }, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              <CountUp end={likes} duration={1} />
            </Typography>
          </Box>
        </Slide>

        <Slide direction="left" in={hovered && totalScore} mountOnEnter unmountOnExit>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            right: '50%',
            transform: { xs: 'translate(120%, -50%)', lg: 'translate(200%, -50%)' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            zIndex: 2,
            gap: 1
          }}>
            <Box sx={{
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              borderRadius: '50%',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Assessment sx={{ fontSize: { xs: 20, md: 24 } }} />
            </Box>
            <Typography variant="caption" sx={{ 
              fontSize: { xs: '0.75rem', md: '0.85rem' }, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {totalScore?.totalScore?.toFixed(1) || 'N/A'}
            </Typography>
          </Box>
        </Slide>
      </Box>
    </Card>
  );
};