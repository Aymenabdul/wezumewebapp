/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  Box,
  IconButton,
  Slide,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Assessment,
  PlayArrow,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../store/appStore";
import CountUp from "react-countup";

export default function VideoCard({ video, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const [scoreLoaded, setScoreLoaded] = useState(false);
  const [touched, setTouched] = useState(false);

  const { userDetails } = useAppStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const hashVideoId = (id) => btoa(id.toString());

  useEffect(() => {
    const fetchUserLikedVideos = async () => {
      try {
        const response = await axiosInstance.get(
          `/videos/likes/status?userId=${userDetails.userId}`
        );
        const likedVideosMap = {};
        Object.entries(response.data).forEach(([videoId, liked]) => {
          likedVideosMap[videoId] = liked;
        });
        setIsLiked(likedVideosMap[video.id] || false);
      } catch (error) {
        // console.error("Error fetching user liked videos:", error);
      }
    };

    if (userDetails?.userId) {
      fetchUserLikedVideos();
    }
  }, [userDetails.userId, video.id]);

  const fetchLikes = async () => {
    if (!likesLoaded) {
      try {
        const likesRes = await axiosInstance.get(`/videos/${video.id}/like-count`);
        setLikes(likesRes.data);
        setLikesLoaded(true);
      } catch (error) {
        // console.error("Error fetching likes:", error);
      }
    }
  };

  const fetchScore = async () => {
    if (!scoreLoaded) {
      try {
        const scoreRes = await axiosInstance.get(`/totalscore/${video.id}`);
        setTotalScore(scoreRes.data);
        setScoreLoaded(true);
      } catch (error) {
        // console.error("Error fetching score:", error);
        setScoreLoaded(true);
      }
    }
  };

  const handleInteraction = async () => {
    if (isMobile) {
      setTouched(!touched);
    } else {
      setHovered(true);
    }

    fetchLikes();
    fetchScore();
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      handleInteraction();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovered(false);
    }
  };

  const handleTouchStart = (e) => {
    if (isMobile) {
      e.preventDefault();
      handleInteraction();
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const endpoint = isLiked ? "dislike" : "like";
      await axiosInstance.post(
        `/videos/${video.id}/${endpoint}?userId=${userDetails.userId}&firstName=${userDetails.firstName}`
      );

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleClick = () => {
    if (isMobile && !touched) {
      handleInteraction();
      return;
    }

    // Use the provided onClick prop if available, otherwise fallback to default navigation
    if (onClick) {
      onClick();
    } else {
      // Fallback to default navigation (shouldn't happen with new implementation)
      navigate(`/app/video/${hashVideoId(video.id)}`);
    }
  };

  const showSlide = isMobile ? touched : hovered;

  return (
    <Card
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        aspectRatio: "1 / 1",
        borderRadius: { xs: 2, sm: 3, md: 4 },
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: (theme) => (isMobile ? "none" : theme.shadows[10]),
          transform: isMobile ? "none" : "translateY(-2px)",
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        image={video?.thumbnail}
        alt="Video thumbnail"
        sx={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
          transition: "opacity 0.3s ease-in-out",
          opacity: showSlide ? 0.6 : 1,
        }}
      >
        <PlayArrow
          sx={{
            fontSize: {
              xs: 32,
              sm: 40,
              md: 50,
              lg: 60,
            },
            color: "white",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        />
      </Box>

      <Slide
        direction="up"
        in={showSlide}
        mountOnEnter
        unmountOnExit
        timeout={{
          enter: 300,
          exit: 200,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            color: "white",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
            ...(isMobile ? {} : { backdropFilter: "blur(4px)" }),
            p: { xs: 1, sm: 1.5, md: 2 },
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: { xs: 0.5, sm: 1, md: 1.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <Avatar
                src={video?.profilepic || video?.profilePic}
                alt={video?.firstname || video?.firstName}
                sx={{
                  width: { xs: 24, sm: 28, md: 32 },
                  height: { xs: 24, sm: 28, md: 32 },
                }}
              >
                {!video?.profilepic && !video?.profilePic && <Person />}
              </Avatar>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold" 
                noWrap
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  maxWidth: { xs: '120px', sm: '150px', md: '200px' }
                }}
              >
                {isMobile && ((video?.firstname || video?.firstName) || '').length > 8 
                  ? `${((video?.firstname || video?.firstName) || '').substring(0, 8)}...`
                  : (video?.firstname || video?.firstName) || ''
                }
              </Typography>
            </Box>
            <Box
              component="img"
              src="/logo-favicon.png"
              alt="Wezume Logo"
              sx={{
                height: { xs: 16, sm: 20, md: 24 },
                width: { xs: 16, sm: 20, md: 24 },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                onClick={handleLike}
                size={isMobile ? "small" : "medium"}
                sx={{
                  color: isLiked ? "error.main" : "white",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  p: { xs: 0.5, sm: 1 },
                }}
                aria-label={isLiked ? "Unlike video" : "Like video"}
              >
                {isLiked ? (
                  <Favorite sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                ) : (
                  <FavoriteBorder
                    sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                  />
                )}
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                }}
              >
                {likesLoaded ? <CountUp end={likes} duration={1} /> : "..."}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <Assessment sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                }}
              >
                {scoreLoaded ? (totalScore?.totalScore?.toFixed(1) || "N/A") : "..."}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Card>
  );
}
