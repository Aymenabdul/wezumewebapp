import { useState, useRef, useEffect } from "react";
import { Box, IconButton, Stack, Typography, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShareIcon from "@mui/icons-material/Share";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import { useSwipeable } from "react-swipeable";
import AnalyticsModal from "./AnalyticsModal";

export default function FullScreenVideoPlayer({ videos, initialIndex, onClose, onLoadMore }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [openModal, setOpenModal] = useState(false);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";
    
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.play();
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
  }, [currentIndex]);

  const handleSwipe = (direction) => {
    if (isScrolling) return;
    
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
    }, 500);
  };

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
  };

  const handleTouchEnd = (event) => {
    if (!touchStartY.current) return;
    
    touchEndY.current = event.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY.current;
    const threshold = 50;
    
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
    event.preventDefault();
    event.stopPropagation();
    
    const delta = event.deltaY;
    const threshold = 10;
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        handleSwipe("up");
      } else if (delta < 0) {
        handleSwipe("down");
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => handleSwipe("up"),
    onSwipedDown: () => handleSwipe("down"),
    trackMouse: true,
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 50,
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
        touchAction: "none",
      }}
      {...swipeHandlers}
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

      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
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
            {/* Video Container - Rectangular aspect ratio */}
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", md: "auto" },
                height: { xs: "auto", md: "90vh" },
                maxWidth: { xs: "100vw", md: "60vw" },
                aspectRatio: "9/16", // TikTok/Shorts aspect ratio
                backgroundColor: "black",
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
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {/* Action Buttons - Positioned like YouTube Shorts */}
              <Stack
                spacing={3}
                sx={{
                  position: "absolute",
                  right: 12,
                  bottom: 100,
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                {/* Like Button */}
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

                {/* Analytics Button */}
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

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 16,
                  right: 80,
                  color: "white",
                  zIndex: 10,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    lineHeight: 1.4,
                  }}
                >
                  {video.description || "Amazing video content"}
                </Typography>
              </Box>
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