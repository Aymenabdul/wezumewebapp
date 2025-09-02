import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import {
    Button,
    Box,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Skeleton
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@mui/system";

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

const jelly = keyframes`
    0% { transform: scale(1, 1); }
    25% { transform: scale(1.1, 0.9); }
    50% { transform: scale(0.9, 1.1); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
`;

const AnimationCarousel = lazy(() => import("../components/auth/AnimationCarousel"));

export default function Signup() {
    const [formData, setFormData] = useState({
        displayName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: "",
        role: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isAnimationPaused, setIsAnimationPaused] = useState(false);
    const [showPerson, setShowPerson] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId;
        const handleUserActivity = () => {
            setIsAnimationPaused(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsAnimationPaused(false), 2000);
        };

        document.addEventListener('keydown', handleUserActivity);
        document.addEventListener('click', handleUserActivity);

        return () => {
            document.removeEventListener('keydown', handleUserActivity);
            document.removeEventListener('click', handleUserActivity);
            clearTimeout(timeoutId);
        };
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name === "email") {
            if (value.length > 0) {
                setShowPerson(true);
                setIsExiting(false);
            } else {
                setIsExiting(true);
                setTimeout(() => setShowPerson(false), 400);
            }
        }
    }, []);

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleRoleChange = useCallback((e) => {
        setFormData((prevData) => ({ 
            ...prevData, 
            role: e.target.value 
        }));
    }, []);

    const handleRegister = useCallback(() => {
        navigate("/login");
    }, [navigate]);

    const handleEmailBlur = useCallback(() => {
        if (formData.email.length > 0) {
            setIsExiting(true);
            setTimeout(() => setShowPerson(false), 400);
        }
    }, [formData.email]);

    return (
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
            minHeight: "100vh",
            p: { xs: 0, sm: 1, md: 2 },
            overflow: { xs: "auto", md: "hidden" }
          }}
        >
            <Box
              sx={{
                height: { xs: "100vh", sm: "95vh", md: "95vh" },
                width: { xs: "100%", sm: "95%", md: "85%", lg: "75%" },
                maxWidth: "1200px",
                bgcolor: "white",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                borderRadius: { xs: 0, sm: 2, md: 3 },
                overflow: { xs: "auto", md: "hidden" },
                boxSizing: "border-box",
                filter: "drop-shadow(4px 4px 4px rgba(0,0,0,0.7))",
                willChange: "transform",
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
                      containerHeight={{ xs: "230px", sm: "330px", md: "430px", lg: "530px" }}
                      dotSpacing={1}
                    />
                  </Suspense>
                </Box>

                <Box
                  sx={{
                    height: { xs: "65%", sm: "60%", md: "100%" },
                    width: { xs: "100%", md: "50%" },
                    p: { xs: 2, sm: 2.5, md: 3 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    bgcolor: "white",
                    position: "relative",
                    my: 2,
                    overflow: { xs: "visible", md: "auto" }
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
                            animation: isAnimationPaused 
                              ? "none" 
                              : "typewriter 4s steps(18) infinite, blink 1s infinite",
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
                        gap: { xs: 1.5, md: 2 },
                        width: "100%",
                        maxWidth: { xs: "90%", sm: "320px", md: "350px" },
                        flex: 1,
                        pb: { xs: 2, md: 1 },
                        position: "relative",
                      }}
                    >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            gap: { xs: 1, md: 2 }
                          }}
                        >
                            <TextField 
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                            />
                            <TextField 
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                            />
                        </Box>
             
                        <TextField 
                            label="Display Name"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                        />
                        
                        <Box sx={{ width: "100%", position: "relative" }}>
                            <TextField 
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleEmailBlur}
                                fullWidth
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
                                    right: { xs: "-40px", sm: "-60px" },
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: { xs: 40, sm: 50, md: 70 },
                                    height: "auto",
                                    animation: `${isExiting ? slideOut : slideIn} 0.4s ease forwards`,
                                    pointerEvents: "none",
                                    zIndex: 10,
                                  }}
                                />
                            )}
                        </Box>
                        
                        <TextField 
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            sx={{
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
                                    )
                                }
                            }}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                              labelId="role-label"
                              id="role"
                              name="role"
                              value={formData.role}
                              label="Role"
                              onChange={handleRoleChange}
                              sx={{
                                borderRadius: "8px",
                              }}
                            >
                                <MenuItem value="Employee">Employee</MenuItem>
                                <MenuItem value="Recruiter">Recruiter</MenuItem>
                                <MenuItem value="Investor">Investor</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Button 
                            fullWidth
                            variant="contained" 
                            disableElevation 
                            onClick={handleRegister}
                            sx={{
                              background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
                              py: { xs: 1.2, md: 1.5 },
                              fontSize: { xs: "16px", sm: "17px", md: "18px" },
                              fontWeight: "700",
                              borderRadius: "8px",
                              textTransform: "none",
                              transition: "all 0.2s ease",
                              flexShrink: 0,
                              mt: { xs: 1, md: 1.5 },
                              "&:hover": {
                                animation: `${jelly} 0.5s ease`,
                                boxShadow: "0 8px 20px 0 rgba(28,167,236,0.6)",
                                background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
                                transform: "translateY(-2px)",
                              },
                              "&:active": {
                                transform: "scale(0.98)",
                              },
                            }}
                        >
                            Register
                        </Button>

                        <Typography variant="caption" fontSize={{ xs: 13, md: 14 }} color="grey">
                            Already have an account? <Link to="/login" style={{ color: "#1CA7EC" }}>Login</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}