import { lazy, Suspense, useState } from "react";
import {
  Button,
  Box,
  Container,
  Skeleton,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { Link, useNavigate } from "react-router"; 
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const AnimationCarousel = lazy(() => import("../components/auth/AnimationCarousel"));

const jelly = keyframes`
  0% { transform: scale(1, 1); }
  25% { transform: scale(1.1, 0.9); }
  50% { transform: scale(0.9, 1.1); }
  75% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1, 1); }
`;

const slideIn = keyframes`
  0% {
    transform: translateX(100px) translateY(-50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0) translateY(-50%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0) translateY(-50%);
    opacity: 1;
  }
  100% {
    transform: translateX(100px) translateY(-50%);
    opacity: 0;
  }
`;

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPerson, setShowPerson] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));

    if (value.length > 0) {
      setShowPerson(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      setTimeout(() => setShowPerson(false), 400); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)",
        minHeight: "100vh",
        p: { xs: 0, md: 2 },
        overflowY: { xs: "auto", md: "hidden" }
      }}
    >
      <Box
        sx={{
          height: { xs: "100vh", sm: "100vh", md: "95vh" }, 
          width: { xs: "100%", md: "85%", lg: "75%" },
          maxWidth: "1200px",
          bgcolor: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: { xs: 0, sm: 2, md: 3 },
          overflow: "hidden",
          boxSizing: "border-box",
          filter: "drop-shadow(4px 4px 4px rgba(0,0,0,0.7))",
        }}
      >
        <Box
          sx={{
            height: { xs: "35%", sm: "40%", md: "100%" },
            width: { xs: "100%", md: "50%" },
            background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)",
            p: { xs: 1.5, sm: 2, md: 3 },
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "250px", sm: "350px", md: "450px", lg: "550px" },
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
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[0, 1, 2].map((index) => (
                    <Skeleton key={index} variant="circular" width={8} height={8} />
                  ))}
                </Box>
              </Box>
            }
          >
            <AnimationCarousel
              autoPlay={true}
              interval={4000}
              showDots={true}
              containerHeight={{ xs: "250px", sm: "350px", md: "450px", lg: "550px" }}
              dotSpacing={1}
            />
          </Suspense>
        </Box>

        <Box
          sx={{
            height: { xs: "65%", md: "100%" },
            width: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 2.5, md: 3 },
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "white",
            position: "relative",
            overflow: "visible", 
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 0.5, sm: 0.5, md: 1 },
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/wezumelogo.png"
              alt="Wezume Logo"
              loading="lazy"
              sx={{
                width: { xs: 100, sm: 120, md: 120, lg: 140 },
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.2))",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 1.5, sm: 2, md: 3 }, 
              flexShrink: 0,
              height: { xs: "24px", sm: "28px", md: "28px" }, 
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "16px", sm: "18px", md: "18px", lg: "20px" }, 
                background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))",
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderRight: "2px solid #1CA7EC",
                width: "0",
                animation: "typewriter 4s steps(18) infinite, blink 1s infinite",
                "@keyframes typewriter": {
                  "0%": { width: "0" },
                  "50%": { width: "100%" },
                  "100%": { width: "0" },
                },
                "@keyframes blink": {
                  "0%, 50%": { borderColor: "#1CA7EC" },
                  "51%, 100%": { borderColor: "transparent" },
                },
              }}
            >
              Speak Up . Stand Out
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 1.5, sm: 1.8, md: 2.5 }, 
              width: "100%",
              maxWidth: { xs: "100%", sm: "350px", md: "380px" },
              position: "relative",
              flex: 1, 
              justifyContent: "flex-start", 
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                display: "flex",
                gap: 1,
                py: { xs: 1, md: 1.2 },
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                flexShrink: 0,
              }}
            >
              <LinkedInIcon />
              Login with LinkedIn
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                my: { xs: 0.3, md: 1 },
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#ddd",
                }}
              />
              <Typography
                sx={{
                  mx: 2,
                  color: "#666",
                  fontSize: { xs: "12px", sm: "13px", md: "14px" },
                }}
              >
                Or Login With
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#ddd",
                }}
              />
            </Box>

            <Box sx={{ width: "100%", position: "relative", flexShrink: 0 }}>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleEmailChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />

              {showPerson && (
                <Box
                  component="img"
                  src="/person.png"
                  alt="Peeking Person"
                  loading="lazy"
                  sx={{
                    position: "absolute",
                    right: "-70px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 60, md: 80 },
                    height: "auto",
                    animation: `${isExiting ? slideOut : slideIn} 0.4s ease forwards`,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              )}
            </Box>

            <Box sx={{ width: "100%", position: "relative", flexShrink: 0 }}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                sx={{
                  flexShrink: 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button 
                  variant="text"
                  onClick={() => navigate("/forgot-password")}
                  sx={{ 
                    color: "#1CA7EC", 
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "none",
                    minHeight: "32px",
                    padding: "6px 12px",
                    "&:hover": {
                      backgroundColor: "rgba(28, 167, 236, 0.08)",
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => navigate("/app/dashboard")}
              sx={{
                background: "linear-gradient(135deg, #1CA7EC, #7BD5F5)",
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: "16px", sm: "17px", md: "18px" },
                fontWeight: "700",
                borderRadius: "8px",
                textTransform: "none",
                transition: "all 0.3s ease",
                flexShrink: 0,
                "&:hover": {
                  animation: `${jelly} 0.6s ease`,
                  boxShadow: "0 8px 20px 0 rgba(28,167,236,0.6)",
                  background: "linear-gradient(135deg, #7BD5F5, #1CA7EC)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              Login
            </Button>

            <Box 
              sx={{ 
                textAlign: "center",
                pb: { xs: 1, md: 0 }, 
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "12px", sm: "13px", md: "14px" },
                  color: "#666",
                  flexShrink: 0,
                }}
              >
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: "#1CA7EC", 
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}