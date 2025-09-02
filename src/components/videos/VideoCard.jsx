import { useState, useEffect } from "react";
import { Card, CardActionArea, CardMedia, Typography, Box, Skeleton, IconButton } from "@mui/material";
import { ThumbUp, Star } from "@mui/icons-material";

export default function VideoCard({ video, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLikeClick = (e) => {
    e.stopPropagation(); 
    setIsLiked(!isLiked);
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
        aspectRatio: "1/1", // Maintain square aspect ratio
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
      <CardActionArea
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
          image={video.thumb}
          alt={`Thumbnail for ${video.title} video`}
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
        
        {isHovered && loaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 1,
              color: "white",
            }}
          >
            <Box />
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  onClick={handleLikeClick}
                  size="small"
                  sx={{
                    color: isLiked ? "#ff4444" : "white",
                    padding: 0.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ThumbUp fontSize="small" />
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {video.views || "0"}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Star fontSize="small" sx={{ color: "#ffd700" }} />
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {video.score || "4.8"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
}