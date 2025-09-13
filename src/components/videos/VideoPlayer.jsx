/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
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
  Alert,
  Typography,
  Chip,
} from "@mui/material";
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
  Comment,
  Mic,
} from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router";
import { createPortal } from "react-dom";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../store/appStore";
import ScoreEvaluation from "./ScoreEvaluation";
import CommentsSection from "./CommentsSection";

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const videoRef = useRef();
  const containerRef = useRef();
  const mobileContainerRef = useRef();
  const videoContainerRef = useRef();

  const [video, setVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scoreData, setScoreData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [subtitles, setSubtitles] = useState({});
  const [subtitlesFetched, setSubtitlesFetched] = useState(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { userDetails, videos, isLoadingVideos, getVideos } = useAppStore();

  let decodedVideoId;
  try {
    decodedVideoId = videoId ? atob(videoId) : null;
  } catch (error) {
    console.error("Error decoding video ID:", error);
    decodedVideoId = null;
  }

  const convertSrtToVtt = (srtContent) => {
    if (!srtContent) return "";
    let vttContent = "WEBVTT\n\n";
    vttContent += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
    return vttContent;
  };

  const fetchSubtitles = async (videoId) => {
    if (!videoId || subtitlesFetched.has(videoId)) return;

    setSubtitlesFetched((prev) => new Set(prev).add(videoId));

    try {
      const response = await axiosInstance.get(
        `/videos/user/${videoId}/subtitles.srt`,
        {
          responseType: "text",
          timeout: 10000,
        }
      );

      if (response.data && response.data.trim()) {
        const vttContent = convertSrtToVtt(response.data);
        const blob = new Blob([vttContent], { type: "text/vtt" });
        const subtitleUrl = URL.createObjectURL(blob);

        setSubtitles((prev) => ({ ...prev, [videoId]: subtitleUrl }));
      }
    } catch (error) {
      setSubtitlesFetched((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const cleanupBlobs = () => {
    Object.entries(subtitles).forEach(([videoId, url]) => {
      if (url && url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn("Error revoking blob URL:", error);
        }
      }
    });
    setSubtitles({});
    setSubtitlesFetched(new Set());
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/app/videos');
    }
  };

  const fetchLikeData = async (videoId) => {
    if (!videoId || !userDetails?.userId) return;

    try {
      const [likesRes, statusRes] = await Promise.all([
        axiosInstance.get(`/videos/${videoId}/like-count`),
        axiosInstance.get(`/videos/likes/status?userId=${userDetails.userId}`),
      ]);

      setLikeCount(likesRes.data || 0);

      if (statusRes.data && typeof statusRes.data === "object") {
        setIsLiked(statusRes.data[videoId] || false);
      }
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const navigateVideo = useCallback(
    (direction) => {
      if (!videos || videos.length === 0) return;

      const newIndex =
        direction === "next"
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
        const scrollDirection = direction === "next" ? 1 : -1;
        containerRef.current.scrollBy({
          left: scrollDirection * containerRef.current.offsetWidth,
          behavior: "smooth",
        });
      }

      setTimeout(() => setIsScrolling(false), 1000);
    },
    [videos, currentIndex, navigate, isMobile]
  );

  useEffect(() => {
    if (!isMobile || !mobileContainerRef.current) return;

    let touchStartY = null;
    let touchStartX = null;
    let touchStartTime = null;
    const minSwipeDistance = 80;
    const maxSwipeTime = 800;

    const handleTouchStart = (e) => {
      if (e.touches[0].clientY < 100) {
        e.preventDefault();
      }

      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e) => {
      if (touchStartY && e.touches[0].clientY < touchStartY) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartY || !touchStartX || !touchStartTime) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();

      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);
      const duration = touchEndTime - touchStartTime;

      touchStartY = null;
      touchStartX = null;
      touchStartTime = null;

      if (duration > maxSwipeTime) return;
      if (Math.abs(deltaY) < minSwipeDistance) return;
      if (deltaX > Math.abs(deltaY)) return;

      e.preventDefault();
      e.stopPropagation();

      if (deltaY > 0) {
        navigateVideo("next");
      } else {
        navigateVideo("prev");
      }
    };

    const container = mobileContainerRef.current;
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile, navigateVideo]);

  useEffect(() => {
    if (userDetails) {
      fetchVideos();
    }
  }, [userDetails]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      videos.forEach((video) => {
        if (video && video.id) {
          fetchSubtitles(video.id);
        }
      });
    }
  }, [videos]);

  useEffect(() => {
    if (videos && videos.length > 0 && decodedVideoId) {
      const index = videos.findIndex(
        (v) => v && v.id && v.id.toString() === decodedVideoId
      );
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
          navigateVideo("next");
        } else {
          navigateVideo("prev");
        }
      }
    };

    if (containerRef.current && !isMobile) {
      containerRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener("wheel", handleWheel);
        }
      };
    }
  }, [videos, currentIndex, isMobile, navigateVideo]);

  useEffect(() => {
    return () => {
      cleanupBlobs();
    };
  }, []);

  const fetchVideos = async () => {
    try {
      await getVideos();
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const loadVideo = async (videoData) => {
    if (!videoData || !videoData.id) return;

    setVideo(videoData);
    setVideoLoading(false);

    await fetchLikeData(videoData.id);

    if (!subtitlesFetched.has(videoData.id)) {
      fetchSubtitles(videoData.id);
    }

    try {
      const scoreRes = await axiosInstance.get(`/totalscore/${videoData.id}`);
      setScoreData(scoreRes.data);
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  const handleLike = async () => {
    if (!video || !video.id || !userDetails) return;

    try {
      const endpoint = isLiked ? "dislike" : "like";
      await axiosInstance.post(
        `/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`
      );

      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      setLikeCount((prev) =>
        newLikedStatus ? prev + 1 : Math.max(0, prev - 1)
      );

      if (videos && videos[currentIndex]) {
        videos[currentIndex].isLiked = newLikedStatus;
        videos[currentIndex].liked = newLikedStatus;
        videos[currentIndex].likeCount = newLikedStatus
          ? (videos[currentIndex].likeCount || 0) + 1
          : Math.max(0, (videos[currentIndex].likeCount || 0) - 1);
      }

      showSnackbar(
        newLikedStatus ? "Video liked!" : "Video unliked!",
        "success"
      );
    } catch (error) {
      console.error("Error liking video:", error);
      showSnackbar("Failed to update like status", "error");
    }
  };

  const handleShare = () => {
    if (!video) return;

    const videoUrl = `${window.location.origin}/app/video/${btoa(
      video.id.toString()
    )}`;
    navigator.clipboard
      .writeText(videoUrl)
      .then(() => {
        showSnackbar("Video link copied to clipboard!", "success");
      })
      .catch(() => {
        showSnackbar("Failed to copy video link", "error");
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

  const handleVideoContainerClick = (e) => {
    const target = e.target;
    const isButton =
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest('[role="button"]');
    const isVideoControl =
      target.closest("video") || target.tagName === "VIDEO";

    if (isButton || isVideoControl) {
      e.stopPropagation();
      return;
    }

    e.stopPropagation();
  };

  const enableSubtitles = (videoElement) => {
    if (
      videoElement &&
      videoElement.textTracks &&
      videoElement.textTracks.length > 0
    ) {
      setTimeout(() => {
        Array.from(videoElement.textTracks).forEach((track) => {
          if (track.kind === "subtitles" || track.kind === "captions") {
            track.mode = "showing";
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!video || !videos || videos.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button onClick={handleBackNavigation}>
          No videos available - Go back
        </Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <>
      {createPortal(<IconButton
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
        </IconButton>, document.body)}
      <Box
        ref={mobileContainerRef}
        sx={{
          height: "100%",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "black",
          zIndex: 1300,
          overflow: "hidden",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>
          {`
            html, body {
              overscroll-behavior: none !important;
              overscroll-behavior-y: none !important;
              overscroll-behavior-x: none !important;
            }
            
            /* Prevent pull-to-refresh on mobile browsers */
            body {
              position: fixed;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            
            /* Video subtitle styling */
            video::cue {
              font-size: 14px !important;
              line-height: 1.2 !important;
              background-color: rgba(0, 0, 0, 0.6) !important;
              color: white !important;
            }
          `}
        </style>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {videoLoading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <CircularProgress sx={{ color: "white" }} />
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
              width: "100%",
              height: "100%",
              objectFit: "cover",
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

          {video.description && (
            <Box
              sx={{
                position: "absolute",
                bottom: 80,
                left: 20,
                right: 100,
                zIndex: 10,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontSize: "0.875rem",
                  lineHeight: 1.4,
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {video.description}
              </Typography>
            </Box>
          )}

          <style>
            {`
              video::cue {
                font-size: 14px !important;
                line-height: 1.2 !important;
                background-color: rgba(0, 0, 0, 0.6) !important;
                color: white !important;
              }
            `}
          </style>

          {/* Left Side Actions */}
          <Box
            sx={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              zIndex: 10,
            }}
          >
            
            <Fab
              size="small"
              onClick={() => setScoreModalOpen(true)}
              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#1976d2" }}
            >
              <Assessment />
            </Fab>
          </Box>

          <Box
            sx={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              zIndex: 10,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Fab
                size="small"
                onClick={handleLike}
                sx={{
                  bgcolor: isLiked ? "#e91e63" : "rgba(255,255,255,0.9)",
                  color: isLiked ? "white" : "#e91e63",
                  "&:hover": {
                    bgcolor: isLiked ? "#c2185b" : "rgba(255,255,255,1)",
                  },
                }}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </Fab>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "white",
                  mt: 0.5,
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {likeCount}
              </Typography>
            </Box>
            <Fab
              size="small"
              onClick={handleShare}
              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#1976d2" }}
            >
              <Share />
            </Fab>
            <Fab
              size="small"
              onClick={handleCall}
              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#4caf50" }}
            >
              <Phone />
            </Fab>
            <Fab
              size="small"
              onClick={handleEmail}
              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#ff9800" }}
            >
              <Email />
            </Fab>
            <Fab
              size="small"
              onClick={() => setCommentsModalOpen(true)}
              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#607d8b" }}
            >
              <Comment />
            </Fab>
          </Box>
        </Box>

        <Modal
          open={scoreModalOpen}
          onClose={() => setScoreModalOpen(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              width: "90vw",
              height: "80vh",
              p: 2,
              overflow: "auto",
              position: "relative",
              borderRadius: 2,
            }}
          >
            <IconButton
              onClick={() => setScoreModalOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              ✕
            </IconButton>
            <ScoreEvaluation scoreData={scoreData} video={video} />
          </Paper>
        </Modal>

        <Modal
          open={commentsModalOpen}
          onClose={() => setCommentsModalOpen(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              width: "90vw",
              height: "80vh",
              p: 2,
              overflow: "auto",
              position: "relative",
              borderRadius: 2,
            }}
          >
            <IconButton
              onClick={() => setCommentsModalOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              ✕
            </IconButton>
            <CommentsSection videoId={video.id} />
          </Paper>
        </Modal>
      </Box>
      </>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackNavigation}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            bgcolor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#f5f5f5",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            },
          }}
        >
          Back to Videos
        </Button>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          p: 2,
          overflowX: "hidden",
          position: "relative",
          bgcolor: "#fafafa",
        }}
      >
        <Box
          ref={videoContainerRef}
          sx={{
            flex: 1,
            position: "relative",
            bgcolor: "black",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
          onClick={handleVideoContainerClick}
        >
          {videoLoading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <CircularProgress sx={{ color: "white" }} />
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
            style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
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

          <style>
            {`
              video::cue {
                font-size: 16px !important;
                line-height: 1.3 !important;
                background-color: rgba(0, 0, 0, 0.7) !important;
                color: white !important;
              }
            `}
          </style>

          <Box
            sx={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                onClick={handleLike}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: isLiked ? "#e91e63" : "#666",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "white",
                  mt: 1,
                  fontWeight: "bold",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {likeCount}
              </Typography>
            </Box>
            <IconButton
              onClick={handleShare}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                color: "#1976d2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Share />
            </IconButton>
            <IconButton
              onClick={handleCall}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                color: "#4caf50",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Phone />
            </IconButton>
            <IconButton
              onClick={handleEmail}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                color: "#ff9800",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Email />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <ScoreEvaluation scoreData={scoreData} video={video} />
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CommentsSection videoId={video.id} />
        </Box>
      </Box>

      <IconButton
        sx={{
          position: "absolute",
          left: 70,
          top: "50%",
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.9)",
            transform: "scale(1.1)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
          },
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigateVideo("prev");
        }}
      >
        <NavigateBefore sx={{ fontSize: 32 }} />
      </IconButton>

      <IconButton
        sx={{
          position: "absolute",
          right: 20,
          top: "50%",
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.9)",
            transform: "scale(1.1)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
          },
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigateVideo("next");
        }}
      >
        <NavigateNext sx={{ fontSize: 32 }} />
      </IconButton>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
