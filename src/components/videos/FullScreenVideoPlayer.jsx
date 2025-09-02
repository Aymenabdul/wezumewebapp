import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Stack, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import StarIcon from "@mui/icons-material/Star";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";

export default function FullScreenVideoPlayer({ videos, initialIndex, onBack, onVideoChange }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (entry.isIntersecting && idx !== activeIndex) {
            setActiveIndex(idx);
            // Call onVideoChange when video changes
            if (onVideoChange) {
              onVideoChange(idx);
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    const children = containerRef.current?.children || [];
    Array.from(children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [activeIndex, onVideoChange]);

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

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        position: "relative",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      ref={containerRef}
    >
      {window.innerWidth > 600 && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            position: "sticky",
            top: 16,
            left: 16,
            zIndex: 10,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          }}
        >
          Back
        </Button>
      )}
      {videos.map((video, idx) => (
        <Box
          key={video.id}
          data-index={idx}
          sx={{
            scrollSnapAlign: "start",
            height: { xs: "80vh", md: "100vh" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "50%" },
              maxWidth: "600px",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <video
              ref={(el) => (videoRefs.current[idx] = el)}
              src={video.src}
              style={{
                width: { xs: "100%", sm: "80%" }[window.innerWidth < 600 ? 'xs' : 'sm'] || "80%",
                height: "100%",
                objectFit: "cover",
                borderRadius: window.innerWidth < 600 ? "0px" : "12px",
              }}
              controls
              playsInline
            />

            {window.innerWidth < 600 && 
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              Back
            </Button>}

            <Stack
              spacing={2}
              sx={{
                position: "absolute",
                right: { xs: "20px", md: "-15px" },
                my: "auto",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <ThumbUpIcon />
                </IconButton>
                <Typography variant="caption" align="center">128</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <StarIcon />
                </IconButton>
                <Typography variant="caption" align="center">78</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <CommentIcon />
                </IconButton>
                <Typography variant="caption" align="center">300</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <ShareIcon />
                </IconButton>
                <Typography variant="caption" align="center">Share</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <CallIcon />
                </IconButton>
                <Typography variant="caption" align="center">Call</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4
                }}
              >
                <IconButton sx={{ bgcolor: "#cdccccff", color: "black" }} size="large">
                  <MailIcon />
                </IconButton>
                <Typography variant="caption" align="center">Mail</Typography>
              </Box>
            </Stack>

          </Box>
        </Box>
      ))}
    </Box>
  );
}