import { useState, useEffect } from "react";
import { 
  Card, 
  CardActionArea, 
  CardMedia, 
  Typography, 
  Box, 
  Skeleton, 
  IconButton,
  Avatar,
  Slide,
  CircularProgress
} from "@mui/material";
import { ThumbUp, Analytics } from "@mui/icons-material";

const AnimatedCounter = ({ value, duration = 300 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationId;
    const startValue = displayValue;
    const endValue = Number(value) || 0;
    const difference = endValue - startValue;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = startValue + (difference * progress);
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (difference !== 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

export default function VideoCard({ video, likes, score, isLiked, onLike, loading, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLikeClick = (e) => {
    e.stopPropagation(); 
    onLike();
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        width: "100%",
        aspectRatio: "1/1", 
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        },
        borderRadius: 3,
      }}
    >
      <Box
        onClick={handleCardClick}
        sx={{
          height: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
        }}
      >
        {!loaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0,
              borderRadius: 3
            }}
          />
        )}
        
        <CardMedia
          component="img"
          image={video?.thumbnail}
          alt={`${video.firstname}'s video thumbnail`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover", 
            display: loaded ? "block" : "none",
          }}
        />
        
        {loaded && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              color: "white",
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <Avatar
              src={video.profilepic}
              alt={video.firstname}
              sx={{ width: 24, height: 24 }}
            >
              {video.firstname?.charAt(0)}
            </Avatar>
            <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
              {video.firstname}
            </Typography>
          </Box>
        )}
        
        {isHovered && loaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              color: "white",
            }}
          >
            <Slide direction="right" in={isHovered} timeout={300}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5,
                  bgcolor: "rgba(0,0,0,0.8)",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5
                }}
              >
                <IconButton
                  onClick={handleLikeClick}
                  size="small"
                  disabled={loading}
                  sx={{
                    color: isLiked ? "#ff4444" : "white",
                    padding: 0.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    "&:disabled": {
                      color: "grey.500"
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ThumbUp fontSize="small" />
                  )}
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: "0.7rem", minWidth: 20 }}>
                  <AnimatedCounter value={likes} />
                </Typography>
              </Box>
            </Slide>
            
            <Slide direction="left" in={isHovered} timeout={300}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5,
                  bgcolor: "rgba(0,0,0,0.8)",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5
                }}
              >
                <Analytics fontSize="small" sx={{ color: "#00bcd4" }} />
                <Typography variant="caption" sx={{ fontSize: "0.7rem", minWidth: 20 }}>
                  {score?.totalScore ? score.totalScore.toFixed(1) : 'N/A'}
                </Typography>
              </Box>
            </Slide>
          </Box>
        )}
      </Box>
    </Card>
  );
}