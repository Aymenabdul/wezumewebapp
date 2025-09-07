/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { 
  Box, 
  IconButton, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Drawer, 
  useMediaQuery, 
  useTheme,
  Snackbar,
  Alert,
  Avatar,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import Analytics from "@mui/icons-material/Analytics";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import axiosInstance from "../../axios/axios";

const encodeVideoId = (videoId) => {
  return btoa(videoId.toString()).replace(/[+/=]/g, (match) => {
    return { '+': '-', '/': '_', '=': '' }[match];
  });
};

const convertSrtToVtt = (srtContent) => {
  if (!srtContent) return '';
  let vttContent = 'WEBVTT\n\n';
  vttContent += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  return vttContent;
};

export default function FullScreenVideoPlayer({ 
  videos, 
  initialIndex, 
  scores = {}, 
  onLikeToggle,
  onVideoChange 
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scoreDrawerOpen, setScoreDrawerOpen] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [subtitles, setSubtitles] = useState({});
  const [subtitlesEnabled, setSubtitlesEnabled] = useState({});
  const [videosLoading, setVideosLoading] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const commentsData = [
    { id: 1, user: "John Doe", comment: "Great confidence in delivery!", time: "2m ago" },
    { id: 2, user: "Jane Smith", comment: "Excellent body language", time: "5m ago" },
    { id: 3, user: "Mike Johnson", comment: "Very engaging speaker!", time: "8m ago" },
    { id: 4, user: "Sarah Wilson", comment: "Clear and articulate", time: "12m ago" },
    { id: 5, user: "Alex Brown", comment: "Professional presentation", time: "15m ago" },
    { id: 6, user: "Lisa Chen", comment: "Good eye contact", time: "18m ago" },
  ];

  const fetchSubtitles = async (videoId) => {
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
        setSubtitlesEnabled(prev => ({ ...prev, [videoId]: true }));
      }
    } catch (error) {
      console.warn('Subtitles not available for video:', videoId);
    }
  };

  useEffect(() => {
    videos.forEach(video => {
      fetchSubtitles(video.id);
      setVideosLoading(prev => ({ ...prev, [video.id]: true }));
    });
  }, [videos]);

  useEffect(() => {
    if (videos[activeIndex]) {
      const encodedId = encodeVideoId(videos[activeIndex].id);
      window.location.hash = `video=${encodedId}`;
    }
  }, [activeIndex, videos]);

  // FIXED: Better navigation with direct scroll calculation
  const navigateToVideo = (targetIndex) => {
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= videos.length) targetIndex = videos.length - 1;
    
    if (targetIndex === activeIndex) return;
    
    setIsScrolling(true);
    setActiveIndex(targetIndex);
    
    const container = containerRef.current;
    if (container) {
      if (isMobile) {
        // Mobile: vertical scroll
        const scrollTop = targetIndex * window.innerHeight;
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      } else {
        // Desktop: horizontal scroll
        const scrollLeft = targetIndex * window.innerWidth;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
    
    if (onVideoChange) {
      onVideoChange(targetIndex);
    }
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // FIXED: Navigation handlers with proper bounds checking
  const handlePrevious = () => {
    navigateToVideo(activeIndex - 1);
  };

  const handleNext = () => {
    navigateToVideo(activeIndex + 1);
  };

  // FIXED: IntersectionObserver that doesn't interfere with manual navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return; // Don't update if manually scrolling
        
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (entry.isIntersecting && entry.intersectionRatio > 0.7 && idx !== activeIndex) {
            setActiveIndex(idx);
            if (onVideoChange) {
              onVideoChange(idx);
            }
          }
        });
      },
      { 
        threshold: [0.5, 0.7, 0.8],
        rootMargin: "0px"
      }
    );

    const children = containerRef.current?.children || [];
    Array.from(children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [activeIndex, onVideoChange, isScrolling]);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      Object.values(subtitles).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [subtitles]);

  const handleLike = (video) => {
    if (onLikeToggle) {
      onLikeToggle(video.id, video.userId, video.firstname, false);
    }
  };

  const handleShare = async (video) => {
    const encodedId = encodeVideoId(video.id);
    const videoUrl = `${window.location.origin}${window.location.pathname}#video=${encodedId}`;
    
    try {
      await navigator.clipboard.writeText(videoUrl);
      setSnackbar({
        open: true,
        message: 'Video URL copied to clipboard!',
        severity: 'success'
      });
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = videoUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setSnackbar({
        open: true,
        message: 'Video URL copied to clipboard!',
        severity: 'success'
      });
    }
  };

  const handleMail = (video) => {
    const subject = encodeURIComponent(`Check out ${video.firstname}'s video`);
    const body = encodeURIComponent(`Hi,\n\nI thought you'd be interested in this video by ${video.firstname}.\n\nBest regards`);
    const mailtoLink = `mailto:${video.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_self');
  };

  const handleCall = (video) => {
    if (video.phonenumber) {
      const telLink = `tel:${video.phonenumber}`;
      window.open(telLink, '_self');
    } else {
      setSnackbar({
        open: true,
        message: 'Phone number not available',
        severity: 'warning'
      });
    }
  };

  const toggleSubtitles = (videoId) => {
    setSubtitlesEnabled(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleBack = () => {
    window.location.href = '/app/videos';
  };

  const handleVideoLoad = (videoId) => {
    setVideosLoading(prev => ({ ...prev, [videoId]: false }));
  };

  const ScoreCard = ({ video }) => {
    const scoreData = scores[video?.id];
    
    return (
      <Card sx={{ width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.95)' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Avatar
              src={video.profilepic}
              alt={video.firstname}
              sx={{ width: 60, height: 60, mr: 2 }}
            >
              {video.firstname?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {video.firstname}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {video.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.phonenumber}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" align="center" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
            Speaking Analysis
          </Typography>
          
          {!scoreData ? (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">Total Score</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {scoreData.totalScore?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.main', color: 'white', borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">Confidence</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {scoreData.confidenceScore?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'info.main', color: 'white', borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">Clarity</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {scoreData.clarityScore?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.main', color: 'white', borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">Emotional</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {scoreData.emotionalScore?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'secondary.main', color: 'white', borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">Authenticity</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {scoreData.authenticityScore?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const CommentsSection = () => (
    <Card sx={{ width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.95)' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1.5 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Comments ({commentsData.length})
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
          {commentsData.map((comment) => (
            <Box key={comment.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                {comment.user}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.3 }}>
                {comment.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {comment.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const ActionButtons = ({ video }) => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100
    }}>
      <IconButton
        onClick={() => handleLike(video)}
        sx={{
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
        }}
      >
        <ThumbUpIcon />
      </IconButton>
      
      <IconButton
        onClick={() => handleShare(video)}
        sx={{
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
        }}
      >
        <ShareIcon />
      </IconButton>
      
      <IconButton
        onClick={() => handleMail(video)}
        sx={{
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
        }}
      >
        <MailIcon />
      </IconButton>
      
      <IconButton
        onClick={() => handleCall(video)}
        sx={{
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
        }}
      >
        <CallIcon />
      </IconButton>

      {subtitles[video.id] && (
        <IconButton
          onClick={() => toggleSubtitles(video.id)}
          sx={{
            bgcolor: subtitlesEnabled[video.id] ? "rgba(28,167,236,0.8)" : "rgba(0,0,0,0.7)",
            color: "white",
            "&:hover": { 
              bgcolor: subtitlesEnabled[video.id] ? "rgba(28,167,236,1)" : "rgba(0,0,0,0.9)" 
            }
          }}
        >
          <ClosedCaptionIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          overflowX: isMobile ? "hidden" : "scroll",
          overflowY: isMobile ? "scroll" : "hidden",
          scrollSnapType: isMobile ? "y mandatory" : "x mandatory",
          position: "relative",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          ...(isMobile && {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          })
        }}
        ref={containerRef}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            position: "fixed",
            top: 16,
            left: isMobile ? 16 : 280,
            zIndex: 10000,
            bgcolor: "rgba(0,0,0,0.7)",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
          }}
        >
          Back
        </Button>

        {/* FIXED: Navigation buttons with proper event handlers */}
        {!isMobile && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "fixed",
                left: 350,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                display: activeIndex === 0 ? "none" : "flex"
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "fixed",
                right: 50,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                display: activeIndex === videos.length - 1 ? "none" : "flex"
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        {videos.map((video, idx) => (
          <Box
            key={video.id}
            data-index={idx}
            sx={{
              scrollSnapAlign: "start",
              width: isMobile ? "100%" : "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {isMobile ? (
              <>
                <Box sx={{ 
                  width: "100%", 
                  height: "100%", 
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  {videosLoading[video.id] && (
                    <Box sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                      bgcolor: "rgba(0,0,0,0.8)",
                      borderRadius: 2,
                      p: 2
                    }}>
                      <CircularProgress sx={{ color: "white" }} />
                    </Box>
                  )}
                  
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={video.videoUrl}
                    style={{
                      width: "100vw",
                      height: "100vh",
                      objectFit: "cover",
                    }}
                    controls
                    playsInline
                    crossOrigin="anonymous"
                    preload="metadata"
                    onLoadStart={() => setVideosLoading(prev => ({ ...prev, [video.id]: true }))}
                    onCanPlay={() => handleVideoLoad(video.id)}
                    onError={() => handleVideoLoad(video.id)}
                  >
                    {subtitles[video.id] && (
                      <track
                        kind="subtitles"
                        src={subtitles[video.id]}
                        label="Subtitles"
                        srcLang="en"
                        default={subtitlesEnabled[video.id]}
                      />
                    )}
                  </video>

                  <ActionButtons video={video} />

                  <IconButton
                    onClick={() => setScoreDrawerOpen(true)}
                    sx={{
                      position: "absolute",
                      left: 16,
                      bottom: 100,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
                    }}
                  >
                    <Analytics />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => setCommentsDrawerOpen(true)}
                    sx={{
                      position: "absolute",
                      left: 16,
                      bottom: 40,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.9)" }
                    }}
                  >
                    <CommentIcon />
                  </IconButton>

                  {/* FIXED: Mobile navigation buttons */}
                  {activeIndex > 0 && (
                    <IconButton
                      onClick={handlePrevious}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 16,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  )}
                  
                  {activeIndex < videos.length - 1 && (
                    <IconButton
                      onClick={handleNext}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 16,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Box>

                <Drawer
                  anchor="bottom"
                  open={scoreDrawerOpen}
                  onClose={() => setScoreDrawerOpen(false)}
                  PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2, maxHeight: '60vh' } }}
                >
                  <ScoreCard video={videos[activeIndex]} />
                </Drawer>

                <Drawer
                  anchor="bottom"
                  open={commentsDrawerOpen}
                  onClose={() => setCommentsDrawerOpen(false)}
                  PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2, maxHeight: '60vh' } }}
                >
                  <CommentsSection />
                </Drawer>
              </>
            ) : (
              <>
                <Box sx={{ 
                  width: "40%", 
                  height: "100vh", 
                  position: "relative"
                }}>
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={video.videoUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    controls
                    playsInline
                    crossOrigin="anonymous"
                    preload="metadata"
                  >
                    {subtitles[video.id] && (
                      <track
                        kind="subtitles"
                        src={subtitles[video.id]}
                        label="Subtitles"
                        srcLang="en"
                        default={subtitlesEnabled[video.id]}
                      />
                    )}
                  </video>
                  <ActionButtons video={video} />
                </Box>

                <Box sx={{ 
                  width: "30%", 
                  height: "100vh", 
                  p: 0
                }}>
                  <ScoreCard video={video} />
                </Box>

                <Box sx={{ 
                  width: "30%", 
                  height: "100vh", 
                  p: 0
                }}>
                  <CommentsSection />
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}