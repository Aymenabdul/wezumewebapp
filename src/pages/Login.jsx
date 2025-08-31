import { useState, useEffect } from "react";
import {
    Button,
    Box,
    Container,
    Divider,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import profileSearchAnimation from "../assets/animations/profile-search.lottie";
import freelancer from "../assets/animations/freelancer.lottie";
import interview from "../assets/animations/interview.lottie";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState(0);
    
    const animations = [
        profileSearchAnimation,
        interview,
        freelancer
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAnimation((prev) => (prev + 1) % animations.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [animations.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDotClick = (index) => {
        setCurrentAnimation(index);
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
            background: "linear-gradient(135deg, #1F2F98 0%, #4A90E2 100%)",
            minHeight: "100vh",
            p: { xs: 0, md: 2, lg: 2 }
          }}
        >
            <Box 
              sx={{
                height: { xs: "100vh", md: "82vh", lg: "82vh" },
                width: { xs: "100%", md: "75%", lg: "70%" },
                maxWidth: "1200px",
                bgcolor: "white",
                display: "flex",
                flexDirection: { xs: "column", md: "row", lg: "row" },
                borderRadius: { xs: 0, md: 3, lg: 3 },
                overflow: "hidden",
                p: { xs: 0, md: 2, lg: 2 },
                boxSizing: "border-box",
              }}
            >   
                <Box
                  sx={{
                    height: { xs: "40%", sm: "30%", md: "100%", lg: "100%" },
                    width: { xs: "100%", md: "50%", lg: "50%" },
                    bgcolor: "#0087e0",
                    borderRadius: { xs: 0, md: 3, lg: 3 },
                    p: { xs: 2, md: 3, lg: 3 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: "80%", md: "85%", lg: "85%" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden"
                      }}
                    >
                        <DotLottieReact 
                            key={currentAnimation} 
                            src={animations[currentAnimation]}
                            loop
                            autoplay
                            style={{
                                width: "100%",
                                height: "100%",
                                maxWidth: "350px",
                                maxHeight: "350px"
                            }}
                        />
                    </Box>
                    
                    <Box
                      sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          mt: { xs: 1, md: 2, lg: 2 }
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
                                bgcolor: currentAnimation === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                                cursor: "pointer",
                                transition: "all 0.4s ease",
                                transform: currentAnimation === index ? "scale(1.1)" : "scale(1)",
                                "&:hover": {
                                bgcolor: currentAnimation === index ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                                transform: currentAnimation === index ? "scale(1.15)" : "scale(1.1)"
                                }
                            }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box
                  sx={{
                    height: { xs: "60%", sm: "70%", md: "100%", lg: "100%" },
                    width: { xs: "100%", sm: "100%", md: "60%", lg: "50%" },
                    p: { xs: 2, md: 3, lg: 2 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: { xs: 3, md: 3, lg: 4 },
                    overflow: "auto",
                    bgcolor: "white"
                  }}
                >
                    <Typography 
                        sx={{ width: "100%", textAlign: "left" }} 
                        variant="h5" 
                        fontWeight={600}
                    >
                        Login
                    </Typography>
                    <Box
                      sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: { xs: 2.5, md: 2.5, lg: 3 },
                          width: "100%",
                          maxWidth: { xs: "100%", md: "400px", lg: "400px" }
                      }}
                    >
                        
                        <Button 
                            fullWidth 
                            variant="contained" 
                            sx={{ 
                                display: "flex", 
                                gap: 1, 
                                py: { xs: 1, md: 1.2, lg: 1 }
                            }}
                        >
                            <LinkedInIcon />
                            Login with LinkedIn
                        </Button>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            width: '100%',
                            my: { xs: 1, md: 1, lg: 1 }
                        }}>
                            <Box sx={{ 
                                flex: 1, 
                                height: '1px', 
                                backgroundColor: '#ddd' 
                            }} />
                            <Typography sx={{ 
                                mx: 2, 
                                color: '#666',
                                fontSize: { xs: '0.875rem', md: '0.875rem', lg: '0.875rem' }
                            }}>
                                Or Login With
                            </Typography>
                            <Box sx={{ 
                                flex: 1, 
                                height: '1px', 
                                backgroundColor: '#ddd' 
                            }} />
                        </Box>
                        
                        <TextField 
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        /> 
                        <TextField 
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
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
                        
                        <Button 
                            fullWidth
                            variant="contained" 
                            disableElevation 
                            onClick={() => navigate("/app/dashboard")}
                            sx={{
                                bgcolor: "#0087e0",
                                py: { xs: 1, md: 1.2, lg: 1.5 },
                                fontSize: { xs: "0.9rem", md: "0.95rem", lg: "1rem" },
                                "&:hover": {
                                    bgcolor: "#0077c7"
                                }
                            }}
                        >
                            Login
                        </Button>
                        <Typography 
                            variant="caption" 
                            fontSize={{ xs: 12, md: 13, lg: 14 }} 
                            color="grey"
                        >
                            Don't have an account? <Link to="/signup" style={{ color: "#0087e0" }}>Sign Up</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};