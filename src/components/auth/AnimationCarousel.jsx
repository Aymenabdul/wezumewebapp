import { useState, useEffect, lazy, Suspense } from "react";
import { Box, Skeleton } from "@mui/material";

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then(module => ({
    default: module.DotLottieReact
  }))
);

const AnimationCarousel = ({
  autoPlay = true,
  interval = 3000,
  showDots = true,
  containerHeight = { xs: "250px", sm: "350px", md: "450px", lg: "550px" },
  dotSpacing = 1
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllAnimations = async () => {
      try {
        const { default: profileSearchAnimation } = await import("../../assets/animations/profile-search.lottie");
        const { default: interview } = await import("../../assets/animations/interview.lottie");
        const { default: freelancer } = await import("../../assets/animations/freelancer.lottie");
        setAnimations([profileSearchAnimation, interview, freelancer]);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };
    loadAllAnimations();
  }, []);

  useEffect(() => {
    if (!autoPlay || animations.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentAnimation(prev => (prev + 1) % animations.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [autoPlay, interval, animations.length]);

  const handleDotClick = (index) => {
    setCurrentAnimation(index);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: containerHeight,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 1, sm: 1, md: 2 },
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: "600px",
            borderRadius: 2,
            mb: 2,
          }}
        />
        {showDots && (
          <Box sx={{ display: "flex", gap: dotSpacing }}>
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} variant="circular" width={8} height={8} />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: containerHeight,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          mb: showDots ? { xs: 1, sm: 1, md: 2 } : 0,
        }}
      >
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                height: "100%",
                maxWidth: "600px",
                borderRadius: 2,
              }}
            />
          }
        >
          {animations.length > 0 && (
            <DotLottieReact
              key={currentAnimation}
              src={animations[currentAnimation]}
              loop
              autoplay
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "600px",
                objectFit: "contain",
              }}
            />
          )}
        </Suspense>
      </Box>

      {showDots && animations.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: dotSpacing,
            flexShrink: 0,
          }}
        >
          {animations.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: currentAnimation === index ? 16 : 8,
                height: 8,
                borderRadius: currentAnimation === index ? "4px" : "50%",
                bgcolor:
                  currentAnimation === index
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.4s ease",
                transform:
                  currentAnimation === index ? "scale(1.1)" : "scale(1)",
                "&:hover": {
                  bgcolor:
                    currentAnimation === index
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.8)",
                  transform:
                    currentAnimation === index ? "scale(1.15)" : "scale(1.1)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AnimationCarousel;