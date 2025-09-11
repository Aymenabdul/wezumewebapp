import { lazy, Suspense, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Box,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const AnimationCarousel = lazy(() => import("../components/auth/AnimationCarousel"));

const jelly = keyframes`
  0% { transform: scale(1, 1); }
  25% { transform: scale(1.1, 0.9); }
  50% { transform: scale(0.9, 1.1); }
  75% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1, 1); }
`;

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", severity: "info" });

  const navigate = useNavigate();

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/update-password?email=${formData.email}&newPassword=${formData.newPassword}`);
      
      if (response.status === 200) {
        setAlert({
          show: true,
          message: "Password updated successfully! Redirecting to login...",
          severity: "success"
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("Password update error:", error);
      const errorMessage = error.response?.data || "Failed to update password. Please try again.";
      setAlert({
        show: true,
        message: String(errorMessage),
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
        minHeight: { xs: "100%", md: "100vh" },
        p: { xs: 0, md: 2 },
        overflowY: { xs: "auto", md: "hidden" }
      }}
    >
      <Box
        sx={{
          maxHeight: { xs: "100%", md: "600px" },
          width: { xs: "100%", md: "85%", lg: "75%" },
          maxWidth: "1200px",
          bgcolor: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
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
            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
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
                  height: { xs: "230px", sm: "330px", md: "430px", lg: "530px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: { xs: 1, sm: 1, md: 2 },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "600px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 2,
                    mb: 2,
                    opacity: 0.7,
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 0.7 },
                      "50%": { opacity: 0.4 },
                      "100%": { opacity: 0.7 },
                    },
                  }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[0, 1, 2].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            }
          >
            <AnimationCarousel
              autoPlay={true}
              interval={4000}
              showDots={true}
              containerHeight={{ xs: "230px", sm: "330px", md: "430px", lg: "480px" }}
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
            mt: { xs: 5, md: 0}
          }}
        >
          {alert.show && (
            <Alert 
              severity={alert.severity}
              onClose={() => setAlert(prev => ({ ...prev, show: false }))}
              sx={{
                width: "100%",
                maxWidth: { xs: "90%", sm: "400px", md: "450px", lg: "380px" },
                mb: 2,
                borderRadius: "8px",
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.875rem', md: '0.9rem' }
                },
                ...(alert.severity === 'success' && {
                  backgroundColor: '#e8f5e8',
                  color: '#2e7d32',
                  '& .MuiAlert-icon': { color: '#2e7d32' }
                }),
                ...(alert.severity === 'error' && {
                  backgroundColor: '#ffeaea',
                  color: '#c62828',
                  '& .MuiAlert-icon': { color: '#c62828' }
                }),
              }}
            >
              {alert.message}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 2, sm: 2, md: 1 },
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/wezumelogo.png"
              alt="Wezume Logo"
              loading="lazy"
              sx={{
                width: { xs: 110, sm: 120, md: 120, lg: 140 },
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
              mb: { xs: 3, sm: 3, md: 3 },
              flexShrink: 0,
              height: { xs: "28px", sm: "30px", md: "28px" },
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "17px", sm: "19px", md: "18px", lg: "20px" },
                background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))",
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderRight: "2px solid #1CA7EC",
                width: "0",
                animation: "typewriter 4s steps(16) infinite, blink 1s infinite",
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
              Reset . Recover
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleUpdatePassword}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 1.5, sm: 1.8, md: 2.5 }, 
              width: "100%",
              maxWidth: { xs: "90%", sm: "320px", md: "380px" },
              position: "relative",
              flex: { xs: 0, md: 1 },
              justifyContent: "center", 
            }}
          >
            <Box sx={{ width: "100%", position: "relative", flexShrink: 0 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "100%", position: "relative", flexShrink: 0 }}>
              <TextField
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
                required
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
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{
                background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)",
                fontSize: { xs: "16px", sm: "17px", md: "18px" },
                fontWeight: "700",
                borderRadius: "8px",
                textTransform: "none",
                transition: "all 0.3s ease",
                flexShrink: 0,
                "&:hover": {
                  animation: `${jelly} 0.6s ease`,
                  boxShadow: "0 8px 20px 0 rgba(28,167,236,0.6)",
                  background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              {loading ? "Updating Password..." : "Update Password"}
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
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  style={{ 
                    color: "#1CA7EC", 
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Back to Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
