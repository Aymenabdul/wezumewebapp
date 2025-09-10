/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  useMediaQuery, 
  useTheme,
  Button,
  Fab,
  CircularProgress,
  Modal,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  NavigateBefore, 
  NavigateNext, 
  Favorite, 
  FavoriteBorder,
  Share,
  Phone,
  Email,
  Assessment,
  Comment
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import axiosInstance from '../../axios/axios';
import { useAppStore } from '../../store/appStore';
import ScoreEvaluation from './ScoreEvaluation';
import CommentsSection from './CommentsSection';

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoRef = useRef();
  const containerRef = useRef();
  const mobileContainerRef = useRef();
  const videoContainerRef = useRef();
  
  const [video, setVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [subtitles, setSubtitles] = useState({});
  const [subtitlesFetched, setSubtitlesFetched] = useState(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const { 
    userDetails, 
    videos, 
    isLoadingVideos, 
    getVideos 
  } = useAppStore();

  let decodedVideoId;
  try {
    decodedVideoId = videoId ? atob(videoId) : null;
  } catch (error) {
    console.error('Error decoding video ID:', error);
    decodedVideoId = null;
  }

  const convertSrtToVtt = (srtContent) => {
    if (!srtContent) return '';
    let vttContent = 'WEBVTT\n\n';
    vttContent += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
    return vttContent;
  };

  const fetchSubtitles = async (videoId) => {
    if (!videoId || subtitlesFetched.has(videoId)) return;
    
    setSubtitlesFetched(prev => new Set(prev).add(videoId));
    
    try {
      const response = await axiosInstance.get(`/videos/user/${videoId}/subtitles.srt`, {
        responseType: 'text',
        timeout: 10000
      });
      
      if (response.data && response.data.trim()) {
        const vttContent = convertSrtToVtt(response.data);
        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const subtitleUrl = URL.createObjectURL(blob);
        
        setSubtitles(prev => ({ ...prev, [videoId]: subtitleUrl }));
      }
    } catch (error) {
      setSubtitlesFetched(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const cleanupBlobs = () => {
    Object.entries(subtitles).forEach(([videoId, url]) => {
      if (url && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Error revoking blob URL:', error);
        }
      }
    });
    setSubtitles({});
    setSubtitlesFetched(new Set());
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBackNavigation = () => {
    // Check if there's a previous history entry
    if (location.key !== 'default' && window.history.length > 1) {
      // There's a previous page in history, go back
      navigate(-1);
    } else {
      // No previous history or came from external link
      // Check if there's a specific return URL in location state
      const returnUrl = location.state?.from || '/app/videos';
      navigate(returnUrl);
    }
  };

  useEffect(() => {
    if (!isMobile || !mobileContainerRef.current) return;

    let startY = 0;
    let startTime = 0;
    const minSwipeDistance = 80;
    const maxSwipeTime = 300;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const distance = startY - endY;
      const duration = endTime - startTime;

      if (Math.abs(distance) > minSwipeDistance && duration < maxSwipeTime) {
        if (distance > 0) {
          navigateVideo('next');
        } else {
          navigateVideo('prev');
        }
      }
    };

    const container = mobileContainerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, videos, currentIndex]);

  useEffect(() => {
    if (userDetails) {
      fetchVideos();
    }
  }, [userDetails]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      videos.forEach(video => {
        if (video && video.id) {
          fetchSubtitles(video.id);
        }
      });
    }
  }, [videos]);

  useEffect(() => {
    if (videos && videos.length > 0 && decodedVideoId) {
      const index = videos.findIndex(v => v && v.id && v.id.toString() === decodedVideoId);
      const foundIndex = index >= 0 ? index : 0;
      setCurrentIndex(foundIndex);
      if (videos[foundIndex]) {
        loadVideo(videos[foundIndex]);
      }
    }
  }, [videos, decodedVideoId]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isMobile) return;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 50) {
        e.preventDefault();
        if (e.deltaX > 0) {
          navigateVideo('next');
        } else {
          navigateVideo('prev');
        }
      } else if (Math.abs(e.deltaY) > 50 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          navigateVideo('next');
        } else {
          navigateVideo('prev');
        }
      }
    };

    if (containerRef.current && !isMobile) {
      containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('wheel', handleWheel);
        }
      };
    }
  }, [videos, currentIndex, isMobile]);

  useEffect(() => {
    return () => {
      cleanupBlobs();
    };
  }, []);

  const fetchVideos = async () => {
    try {
      await getVideos();
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const loadVideo = async (videoData) => {
    if (!videoData || !videoData.id) return;
    
    setVideo(videoData);
    setVideoLoading(false);
    
    if (!subtitlesFetched.has(videoData.id)) {
      fetchSubtitles(videoData.id);
    }
    
    try {
      const scoreRes = await axiosInstance.get(`/totalscore/${videoData.id}`);
      setScoreData(scoreRes.data);
    } catch (error) {
      console.error('Error fetching score data:', error);
    }
  };

  const handleLike = async () => {
    if (!video || !video.id || !userDetails) return;
    
    try {
      const endpoint = isLiked ? 'dislike' : 'like';
      await axiosInstance.post(`/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleShare = () => {
    if (!video) return;
    
    const currentPageUrl = window.location.href;
    navigator.clipboard.writeText(currentPageUrl).then(() => {
      showSnackbar('Page URL copied to clipboard!', 'success');
    }).catch(() => {
      showSnackbar('Failed to copy URL', 'error');
    });
  };

  const handleCall = () => {
    if (!video || !video.phonenumber) return;
    window.open(`tel:${video.phonenumber}`);
  };

  const handleEmail = () => {
    if (!video || !video.email) return;
    window.open(`mailto:${video.email}`);
  };

  const navigateVideo = (direction) => {
    if (!videos || videos.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % videos.length 
      : (currentIndex - 1 + videos.length) % videos.length;
    
    if (!videos[newIndex]) return;
    
    setIsScrolling(true);
    setCurrentIndex(newIndex);
    const nextVideo = videos[newIndex];
    loadVideo(nextVideo);
    
    const hashedId = btoa(nextVideo.id.toString());
    navigate(`/app/video/${hashedId}`, { replace: true });

    if (!isMobile && containerRef.current) {
      const scrollDirection = direction === 'next' ? 1 : -1;
      containerRef.current.scrollBy({ 
        left: scrollDirection * containerRef.current.offsetWidth, 
        behavior: 'smooth' 
      });
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  const handleVideoContainerClick = (e) => {
    const target = e.target;
    const isButton = target.tagName === 'BUTTON' || target.closest('button') || target.closest('[role="button"]');
    const isVideoControl = target.closest('video') || target.tagName === 'VIDEO';
    
    if (isButton || isVideoControl) {
      e.stopPropagation();
      return;
    }
    
    e.stopPropagation();
  };

  const enableSubtitles = (videoElement) => {
    if (videoElement && videoElement.textTracks && videoElement.textTracks.length > 0) {
      setTimeout(() => {
        Array.from(videoElement.textTracks).forEach((track) => {
          if (track.kind === 'subtitles' || track.kind === 'captions') {
            track.mode = 'showing';
          }
        });
      }, 500);
    }
  };

  const handleVideoLoad = (videoElement, videoId) => {
    setVideoLoading(false);
    
    const checkAndEnableSubtitles = () => {
      if (subtitles[videoId]) {
        enableSubtitles(videoElement);
      } else {
        setTimeout(checkAndEnableSubtitles, 200);
      }
    };
    
    setTimeout(checkAndEnableSubtitles, 100);
  };

  if (isLoadingVideos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!video || !videos || videos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Button onClick={handleBackNavigation}>No videos available - Go back</Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box 
        ref={mobileContainerRef}
        sx={{ 
          height: '100vh', 
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'black',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <IconButton
          sx={{ 
            position: 'absolute', 
            top: 20, 
            left: 20, 
            color: 'white', 
            zIndex: 1400,
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }}
          onClick={handleBackNavigation}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {videoLoading && (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}
          
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            autoPlay
            muted={false}
            playsInline
            onLoadedMetadata={(e) => handleVideoLoad(e.target, video.id)}
            onCanPlay={(e) => handleVideoLoad(e.target, video.id)}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }}
            crossOrigin="anonymous"
          >
            {subtitles[video.id] && (
              <track
                key={`subtitle-${video.id}`}
                kind="subtitles"
                src={subtitles[video.id]}
                srcLang="en"
                label="English"
                default
              />
            )}
          </video>
          
          <Box sx={{ 
            position: 'absolute', 
            left: 20, 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 10
          }}>
            <Fab 
              size="small" 
              onClick={() => setScoreModalOpen(true)}
              sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
            >
              <Assessment />
            </Fab>
          </Box>
          
          <Box sx={{ 
            position: 'absolute', 
            right: 20, 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 10
          }}>
            <Fab size="small" onClick={handleLike}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </Fab>
            <Fab size="small" onClick={handleShare}>
              <Share />
            </Fab>
            <Fab size="small" onClick={handleCall}>
              <Phone />
            </Fab>
            <Fab size="small" onClick={handleEmail}>
              <Email />
            </Fab>
            <Fab 
              size="small" 
              onClick={() => setCommentsModalOpen(true)}
              sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
            >
              <Comment />
            </Fab>
          </Box>
        </Box>

        <Modal
          open={scoreModalOpen}
          onClose={() => setScoreModalOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Paper sx={{ 
            width: '90vw', 
            height: '80vh', 
            p: 2, 
            overflow: 'auto',
            position: 'relative'
          }}>
            <IconButton
              onClick={() => setScoreModalOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              ✕
            </IconButton>
            <ScoreEvaluation scoreData={scoreData} video={video} />
          </Paper>
        </Modal>

        <Modal
          open={commentsModalOpen}
          onClose={() => setCommentsModalOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Paper sx={{ 
            width: '90vw', 
            height: '80vh', 
            p: 2, 
            overflow: 'auto',
            position: 'relative'
          }}>
            <IconButton
              onClick={() => setCommentsModalOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              ✕
            </IconButton>
            <CommentsSection videoId={video.id} />
          </Paper>
        </Modal>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBackNavigation}
        >
          Back to Videos
        </Button>
      </Box>

      <Box 
        ref={containerRef}
        sx={{ 
          flex: 1, 
          display: 'flex', 
          gap: 2, 
          p: 2,
          overflowX: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          ref={videoContainerRef}
          sx={{ flex: 1, position: 'relative' }}
          onClick={handleVideoContainerClick}
        >
          {videoLoading && (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}>
              <CircularProgress />
            </Box>
          )}
          
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            onLoadedMetadata={(e) => handleVideoLoad(e.target, video.id)}
            onCanPlay={(e) => handleVideoLoad(e.target, video.id)}
            style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
            crossOrigin="anonymous"
          >
            {subtitles[video.id] && (
              <track
                key={`subtitle-${video.id}`}
                kind="subtitles"
                src={subtitles[video.id]}
                srcLang="en"
                label="English"
                default
              />
            )}
          </video>
          
          <Box sx={{ 
            position: 'absolute', 
            right: 20, 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <IconButton onClick={handleLike}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
            <IconButton onClick={handleCall}>
              <Phone />
            </IconButton>
            <IconButton onClick={handleEmail}>
              <Email />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <ScoreEvaluation scoreData={scoreData} video={video} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <CommentsSection videoId={video.id} />
        </Box>
      </Box>

      <IconButton
        sx={{ 
          position: 'absolute', 
          left: 75, 
          top: '50%',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigateVideo('prev');
        }}
      >
        <NavigateBefore />
      </IconButton>

      <IconButton
        sx={{ 
          position: 'absolute', 
          right: 20, 
          top: '50%',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigateVideo('next');
        }}
      >
        <NavigateNext />
      </IconButton>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
