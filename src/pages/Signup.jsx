import { useState, useEffect } from "react";
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
    Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import profileSearchAnimation from "../assets/animations/profile-search.lottie";
import freelancer from "../assets/animations/freelancer.lottie";
import interview from "../assets/animations/interview.lottie";

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
    const [currentAnimation, setCurrentAnimation] = useState(0);
    
    const animations = [
        freelancer,
        profileSearchAnimation,
        interview,
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
            background: "linear-gradient(135deg, #0087e0 0%, #005bb5 25%, #0099ff 50%, #006dd1 75%, #0087e0 100%)",
            minHeight: "100vh",
            p: { xs: 0, lg: 2 }
          }}
        >
            <Box
              sx={{
                minHeight: { xs: "100vh", lg: "83vh" },
                height: { xs: "auto", lg: "83vh" },
                width: { xs: "100%", lg: "70%" },
                maxWidth: "1200px",
                bgcolor: "white",
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                borderRadius: { xs: 0, lg: 3 },
                overflow: { xs: "visible", lg: "hidden" },
                p: { md: 2 },
                boxSizing: "border-box"
              }}
            >   
                <Box
                  sx={{
                    minHeight: { xs: "250px", lg: "100%" },
                    height: { xs: "auto", lg: "100%" },
                    width: { xs: "100%", lg: "50%" },
                    bgcolor: "#0087e0",
                    borderRadius: { md: 3 },
                    p: { xs: 2, md: 3 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    flexShrink: 0
                  }}
                >
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: "200px", lg: "85%" },
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
                          mt: { xs: 1, lg: 2 }
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
                    minHeight: { xs: "auto", lg: "100%" },
                    height: { xs: "auto", lg: "100%" },
                    width: { xs: "100%", lg: "50%" },
                    p: { xs: 3, md: 2 },
                    pb: { xs: 4, md: 2 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: { xs: 3, md: 4 },
                    overflowY: { xs: "visible", lg: "auto" },
                    bgcolor: "white",
                    flex: 1
                  }}
                >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "400px"
                      }}
                    >
                        <Typography variant="h4" fontWeight={600} sx={{ fontSize: { xs: "1.7rem", md: "2rem" } }}>
                            Create Account
                        </Typography>
                        <Typography variant="caption" fontSize={{ xs: 13, md: 14 }} color="grey">
                            Already have an account? <Link to="/login" style={{ color: "#0087e0" }}>Login</Link>
                        </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: { xs: 2, md: 2.5 },
                          width: "100%",
                          maxWidth: "400px"
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
                                size="small"
                            />
                            <TextField 
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Box>
             
                        <TextField 
                            label="Display Name"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />
                        
                        <TextField 
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />
                        
                        <TextField 
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            size="small"
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
                        
                        <FormControl fullWidth size="small">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                              labelId="role-label"
                              id="role"
                              name="role"
                              value={formData.role}
                              label="Role"
                              onChange={(e) => {
                                  setFormData((prevData) => ({ 
                                      ...prevData, 
                                      role: e.target.value 
                                  }));
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
                            onClick={() => navigate("/login")}
                            sx={{
                                bgcolor: "#0087e0",
                                py: { xs: 1, md: 1.5 },
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                "&:hover": {
                                    bgcolor: "#0077c7"
                                }
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};