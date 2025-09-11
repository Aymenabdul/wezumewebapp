import { useState, useEffect } from 'react';
import { Card, CardMedia, Box, IconButton, Slide, Typography, Avatar } from '@mui/material';
import { Favorite, FavoriteBorder, Assessment, PlayArrow, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import axiosInstance from '../../axios/axios';
import { useAppStore } from '../../store/appStore';
import CountUp from 'react-countup';

export default function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);
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
        aspectRatio: '1 / 1',
        borderRadius: 4,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[10],
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        image={video?.thumbnail}
        alt="Video thumbnail"
        sx={{ 
          objectFit: 'cover',
          width: '100%', 
          height: '100%',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      >
        <PlayArrow sx={{ fontSize: 60, color: 'white' }} />
      </Box>

      <Slide direction="up" in={hovered} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            p: 1.5,
            zIndex: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={video?.profilepic || video?.profilePic} 
                alt={video?.firstname || video?.firstName} 
                sx={{ width: 32, height: 32 }} 
              >
                {(!video?.profilepic || !video?.profilePic) && <Person />}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {video?.firstname || video?.firstName}
              </Typography>
            </Box>
            <Box
              component="img"
              src="/logo-favicon.png"
              alt="Wezume Logo"
              sx={{ height: 24, width: 24 }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton 
                onClick={handleLike} 
                size="small"
                sx={{ 
                  color: isLiked ? 'error.main' : 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                {isLiked ? <Favorite sx={{ fontSize: 20 }} /> : <FavoriteBorder sx={{ fontSize: 20 }} />}
              </IconButton>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {likesLoaded ? <CountUp end={likes} duration={1} /> : '...'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {totalScore?.totalScore?.toFixed(1) || '...'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Card>
  );
}