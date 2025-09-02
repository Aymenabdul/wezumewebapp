import { useState, useRef, useEffect } from "react";
import { Box, IconButton, Stack, Typography, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShareIcon from "@mui/icons-material/Share";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useSwipeable } from "react-swipeable";
import AnalyticsModal from "./AnalyticsModal";

export default function FullScreenVideoPlayer({ videos, initialIndex, onClose, onLoadMore }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [openModal, setOpenModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";
    
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.play();
          video.muted = isMuted;
        } else {
          video.pause();
        }
      }
    });

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [currentIndex, isMuted]);

  const handleSwipe = (direction) => {
    if (isScrolling || openModal) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < 800) return;
    lastScrollTime.current = now;
    
    setIsScrolling(true);
    
    if (direction === "up") {
      if (currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onLoadMore();
      }
    } else if (direction === "down") {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
    
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  const handleTouchStart = (event) => {
    if (openModal) return;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    if (openModal) return;
    event.preventDefault();
  };

  const handleTouchEnd = (event) => {
    if (openModal || !touchStartY.current) return;
    
    touchEndY.current = event.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY.current;
    const threshold = 80;
    
    if (Math.abs(deltaY) > threshold && !isScrolling) {
      if (deltaY > 0) {
        handleSwipe("up");
      } else {
        handleSwipe("down");
      }
    }
    
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const handleScroll = (event) => {
    if (openModal) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const delta = event.deltaY;
    const threshold = 50;
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        handleSwipe("up");
      } else if (delta < 0) {
        handleSwipe("down");
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => !openModal && handleSwipe("up"),
    onSwipedDown: () => !openModal && handleSwipe("down"),
    trackMouse: true,
    preventScrollOnSwipe: !openModal,
    trackTouch: true,
    delta: 80,
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLike = () => {
    const videoId = videos[currentIndex]?.id;
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const getAnalyticsData = (videoTitle) => {
    if (videoTitle.includes("Big Buck Bunny")) {
      return [
        { name: "Confidence", score: 85 },
        { name: "Body Language", score: 90, description: "Aggressive posture during revenge scenes" },
        { name: "Emotion", score: 75, description: "Mix of innocence and determination" },
      ];
    } else if (videoTitle.includes("Elephants Dream")) {
      return [
        { name: "Confidence", score: 70 },
        { name: "Body Language", score: 80, description: "Abstract and surreal movements" },
        { name: "Emotion", score: 65, description: "Confusion and realization" },
      ];
    } else if (videoTitle.includes("Bigger Blazes")) {
      return [
        { name: "Confidence", score: 90 },
        { name: "Body Language", score: 85, description: "Dynamic and assertive gestures" },
        { name: "Emotion", score: 80, description: "Excitement and boldness" },
      ];
    } else {
      return [
        { name: "Confidence", score: 80 },
        { name: "Body Language", score: 75, description: "Varied postures" },
        { name: "Emotion", score: 70, description: "Adventure and escape themes" },
      ];
    }
  };

  const currentVideo = videos[currentIndex];
  const isLiked = likedVideos.has(currentVideo?.id);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "black",
        zIndex: 1300,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        touchAction: openModal ? "auto" : "none",
      }}
      {...(!openModal ? swipeHandlers : {})}
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: { xs: 24, md: 32 },
          left: { xs: 16, md: 24 },
          color: "white",
          zIndex: 1400,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleMuteToggle}
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          top: { xs: 24 },
          left: { xs: 70 },
          color: "white",
          zIndex: 1400,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {isMuted ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
      </IconButton>

      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {videos.map((video, idx) => (
          <Box
            key={video.id}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease-out",
              transform: `translateY(${(idx - currentIndex) * 100}vh)`,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", md: "auto" },
                height: { xs: "100%", md: "90vh" },
                maxWidth: { xs: "100vw", md: "60vw" },
                aspectRatio: { xs: "auto", md: "9/16" },
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={video.src}
                  controls
                  autoPlay={idx === initialIndex}
                  loop
                  muted={isMuted}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: window.innerWidth < 900 ? "0" : "8px",
                  }}
                />

                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                    position: "absolute",
                    right: 12,
                    bottom: 100,
                    zIndex: 10,
                  }}
                >
                  <Stack
                    spacing={3}
                    sx={{
                      alignItems: "center",
                      pointerEvents: openModal ? "none" : "auto",
                      opacity: openModal ? 0.5 : 1,
                      transition: "opacity 0.2s ease-in-out",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <IconButton
                        onClick={handleLike}
                        sx={{
                          color: isLiked ? "#ff4757" : "white",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        {isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          mt: 0.5,
                          fontSize: "10px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        {isLiked ? "1.2K" : "1.1K"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <IconButton
                        onClick={handleOpenModal}
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <BarChartIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          mt: 0.5,
                          fontSize: "10px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        Analytics
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <IconButton
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          mt: 0.5,
                          fontSize: "10px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        Share
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <IconButton
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <MailIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          mt: 0.5,
                          fontSize: "10px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        Message
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <IconButton
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          mt: 0.5,
                          fontSize: "10px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        Call
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 16,
                    right: { xs: 80, md: 16 },
                    color: "white",
                    zIndex: 10,
                    pointerEvents: openModal ? "none" : "auto",
                    opacity: openModal ? 0.5 : 1,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      mb: 3,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {video.title}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <IconButton
              onClick={handleMuteToggle}
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                left: "calc(50% - 32vw - 80px)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: 56,
                height: 56,
                zIndex: 10,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  transform: "translateY(-50%) scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isMuted ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
            </IconButton>

            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                right: 16, 
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >

              <Stack
                spacing={3}
                sx={{
                  alignItems: "center",
                  pointerEvents: openModal ? "none" : "auto",
                  opacity: openModal ? 0.5 : 1,
                  transition: "opacity 0.2s ease-in-out",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <IconButton
                    onClick={handleLike}
                    sx={{
                      color: isLiked ? "#ff4757" : "white",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      width: 56,
                      height: 56,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {isLiked ? <ThumbUpIcon fontSize="large" /> : <ThumbUpOutlinedIcon fontSize="large" />}
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: "12px",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {isLiked ? "1.2K" : "1.1K"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <IconButton
                    onClick={handleOpenModal}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      width: 56,
                      height: 56,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <BarChartIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: "12px",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    Analytics
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      width: 56,
                      height: 56,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ShareIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: "12px",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    Share
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      width: 56,
                      height: 56,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <MailIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: "12px",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    Message
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      width: 56,
                      height: 56,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: "12px",
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    Call
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>

      <AnalyticsModal
        open={openModal}
        onClose={handleCloseModal}
        data={getAnalyticsData(videos[currentIndex]?.title || "")}
      />
    </Box>
  );
}