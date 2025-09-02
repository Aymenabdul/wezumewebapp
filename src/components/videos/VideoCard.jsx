import { useState, useEffect } from "react";
import { Card, CardActionArea, CardMedia, Typography, Box, Skeleton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function VideoCard({ video, onClick }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      variant="outlined"
      sx={{
        height: { xs: 300, md: 450 },
        width: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
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
            sx={{ position: "absolute", top: 0, left: 0 }}
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            p: 1.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.9)",
              transform: "translate(-50%, -50%) scale(1.1)",
            },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
            p: 1,
            color: "#fff",
          }}
        >
          <Typography variant="body2" fontWeight="bold" noWrap>
            {video.title}
          </Typography>
          <Typography variant="caption" noWrap sx={{ opacity: 0.9 }}>
            {video.views} views
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}