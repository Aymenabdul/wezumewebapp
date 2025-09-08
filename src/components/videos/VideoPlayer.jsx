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
  Paper
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
import { useParams, useNavigate } from 'react-router';
import axiosInstance from '../../axios/axios';
import { useAppStore } from '../../store/appStore';
import ScoreEvaluation from './ScoreEvaluation';
import CommentsSection from './CommentsSection';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoRef = useRef();
  const containerRef = useRef();
  const scrollContainerRef = useRef();
  const videoContainerRef = useRef();
  
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [subtitles, setSubtitles] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);
  const { userDetails } = useAppStore();

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
    if (!videoId || subtitles[videoId]) return;
    try {
      const response = await axiosInstance.get(`/api/videos/user/${videoId}/subtitles.srt`, {
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
      console.warn('Subtitles not available for video:', videoId);
    }
  };

  const cleanupBlobs = () => {
    Object.values(subtitles).forEach(url => {
      if (url && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Error revoking blob URL:', error);
        }
      }
    });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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
      
      if (isMobile && scrollContainerRef.current) {
        setTimeout(() => {
          scrollContainerRef.current.scrollTo({
            top: foundIndex * window.innerHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [videos, decodedVideoId]);

  useEffect(() => {
    if (!containerRef.current || !videos || videos.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            const idx = Number(entry.target.dataset.index);
            if (idx !== currentIndex && videos[idx]) {
              setCurrentIndex(idx);
              const nextVideo = videos[idx];
              if (nextVideo && nextVideo.id) {
                loadVideo(nextVideo);
                const hashedId = btoa(nextVideo.id.toString());
                navigate(`/app/video/${hashedId}`, { replace: true });
              }
            }
          }
        });
      },
      { threshold: [0.5, 0.7, 0.8], rootMargin: "0px" }
    );

    const children = containerRef.current?.children || [];
    Array.from(children).forEach((child) => observer.observe(child));
    
    return () => observer.disconnect();
  }, [videos, currentIndex, isScrolling]);

  useEffect(() => {
    return () => {
      cleanupBlobs();
    };
  }, []);

  useEffect(() => {
    return () => {
      cleanupBlobs();
    };
  }, [subtitles]);

  const fetchVideos = async () => {
    try {
      if (!userDetails) {
        setInitialLoading(false);
        return;
      }

      const endpoint = userDetails.jobOption === 'placementDrive' || userDetails.jobOption === 'Academy' 
        ? `/api/videos/job/${userDetails.jobId}`
        : '/api/videos/videos';
      
      const response = await axiosInstance.get(endpoint);
      const videoData = response.data || [];
      setVideos(videoData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadVideo = async (videoData) => {
    if (!videoData || !videoData.id) return;
    
    setVideo(videoData);
    setVideoLoading(false);
    
    if (!subtitles[videoData.id]) {
      await fetchSubtitles(videoData.id);
    }
    
    try {
      const scoreRes = await axiosInstance.get(`/api/totalscore/${videoData.id}`);
      setScoreData(scoreRes.data);
    } catch (error) {
      console.error('Error fetching score data:', error);
    }
  };

  const handleLike = async () => {
    if (!video || !video.id || !userDetails) return;
    
    try {
      const endpoint = isLiked ? 'dislike' : 'like';
      await axiosInstance.post(`/api/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleShare = () => {
    if (!video || !video.videoUrl) return;
    navigator.clipboard.writeText(video.videoUrl);
    alert('Video URL copied to clipboard!');
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
    } else if (isMobile && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  const handleMobileScroll = (e) => {
    if (!isMobile || !scrollContainerRef.current || isScrolling || !videos || videos.length === 0) return;
    
    const scrollTop = e.target.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length && videos[newIndex]) {
      setCurrentIndex(newIndex);
      const nextVideo = videos[newIndex];
      loadVideo(nextVideo);
      
      const hashedId = btoa(nextVideo.id.toString());
      navigate(`/app/video/${hashedId}`, { replace: true });
    }
  };

  const handleMouseMove = (e) => {
    if (!isMobile && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      
      if (x < width * 0.15) {
        videoContainerRef.current.style.cursor = 'w-resize';
      } else if (x > width * 0.85) {
        videoContainerRef.current.style.cursor = 'e-resize';
      } else {
        videoContainerRef.current.style.cursor = 'default';
      }
    }
  };

  const handleVideoContainerClick = (e) => {
    if (!isMobile && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      
      if (y > height * 0.85 || (x > width * 0.15 && x < width * 0.85)) {
        return;
      }
      
      if (x < width * 0.15) {
        navigateVideo('prev');
      } else if (x > width * 0.85) {
        navigateVideo('next');
      }
    }
  };

  const enableSubtitles = (videoElement) => {
    if (videoElement && videoElement.textTracks && videoElement.textTracks.length > 0) {
      Array.from(videoElement.textTracks).forEach((track) => {
        if (track.kind === 'subtitles' || track.kind === 'captions') {
          track.mode = 'showing';
          track.addEventListener('load', () => {
            track.mode = 'showing';
          });
        }
      });
    }
  };

  const handleVideoLoad = (videoElement) => {
    setVideoLoading(false);
    setTimeout(() => {
      enableSubtitles(videoElement);
    }, 300);
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!video || !videos || videos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Button onClick={() => navigate('/app/videos')}>No videos available - Go back</Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'black',
        zIndex: 1300
      }}>
        <IconButton
          sx={{ 
            position: 'fixed', 
            top: 20, 
            left: 20, 
            color: 'white', 
            zIndex: 1400,
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }}
          onClick={() => navigate('/app/videos')}
        >
          <ArrowBack />
        </IconButton>

        <Box 
          ref={scrollContainerRef}
          sx={{ 
            height: '100vh', 
            width: '100vw',
            overflow: 'auto',
            scrollSnapType: 'y mandatory'
          }}
          onScroll={handleMobileScroll}
        >
          {videos.map((vid, index) => {
            if (!vid || !vid.id) return null;
            
            return (
              <Box 
                key={vid.id} 
                data-index={index}
                ref={index === 0 ? containerRef : null}
                sx={{ 
                  height: '100vh', 
                  width: '100vw',
                  position: 'relative',
                  scrollSnapAlign: 'start'
                }}
              >
                {videoLoading && index === currentIndex && (
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
                  key={`${vid.id}-${index}`}
                  ref={index === currentIndex ? videoRef : null}
                  src={vid.videoUrl}
                  controls
                  autoPlay={index === currentIndex}
                  muted={index !== currentIndex}
                  playsInline
                  onLoadedMetadata={(e) => {
                    if (index === currentIndex) {
                      handleVideoLoad(e.target);
                    }
                  }}
                  onCanPlay={(e) => {
                    if (index === currentIndex) {
                      handleVideoLoad(e.target);
                    }
                  }}
                  onLoadStart={() => {
                    if (index === currentIndex && !subtitles[vid.id]) {
                      fetchSubtitles(vid.id);
                    }
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                >
                  {subtitles[vid.id] && (
                    <track
                      key={`subtitle-${vid.id}`}
                      kind="subtitles"
                      src={subtitles[vid.id]}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                </video>
                
                {index === currentIndex && (
                  <>
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
                  </>
                )}
              </Box>
            );
          })}
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
          onClick={() => navigate('/app/videos')}
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
          onMouseMove={handleMouseMove}
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
            onLoadedMetadata={(e) => handleVideoLoad(e.target)}
            onCanPlay={(e) => handleVideoLoad(e.target)}
            onLoadStart={() => {
              if (!subtitles[video.id]) {
                fetchSubtitles(video.id);
              }
            }}
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

          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '15%',
            height: '85%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            bgcolor: 'rgba(0,0,0,0.1)',
            transition: 'opacity 0.3s',
            '&:hover': { opacity: 1 },
            pointerEvents: 'none'
          }}>
            <NavigateBefore sx={{ color: 'white', fontSize: 40 }} />
          </Box>

          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '15%',
            height: '85%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            bgcolor: 'rgba(0,0,0,0.1)',
            transition: 'opacity 0.3s',
            '&:hover': { opacity: 1 },
            pointerEvents: 'none'
          }}>
            <NavigateNext sx={{ color: 'white', fontSize: 40 }} />
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
          left: 20, 
          top: '50%',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
        }}
        onClick={() => navigateVideo('prev')}
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
        onClick={() => navigateVideo('next')}
      >
        <NavigateNext />
      </IconButton>
    </Box>
  );
};

export default VideoPlayer;