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
  Alert,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { 
  Visibility, 
  VisibilityOff, 
  CloudUpload, 
  InsertDriveFile 
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import axios from "axios";
import successAnimation from "../assets/animations/success.lottie";

const jelly = keyframes`
    0% { transform: scale(1, 1); }
    25% { transform: scale(1.1, 0.9); }
    50% { transform: scale(0.9, 1.1); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
`;

const AnimationCarousel = lazy(() => import("../components/auth/AnimationCarousel"));
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const URL = import.meta.env.VITE_API_URL;

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        jobOption: "",
        profilePic: null,
        industry: "",
        currOrganizationName: "",
        city: "",
        jobid: "",
        college: "",
        branch: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isAnimationPaused, setIsAnimationPaused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailValidating, setEmailValidating] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [alert, setAlert] = useState({ show: false, message: "", severity: "info" });
    const [cities, setCities] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [success, setSuccess] = useState(false);

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

    useEffect(() => {
        setCities([
            { id: 1, name: "New York" },
            { id: 2, name: "Los Angeles" },
            { id: 3, name: "Chicago" },
            { id: 4, name: "Houston" },
            { id: 5, name: "Phoenix" }
        ]);
        setIndustries([
            { id: 1, name: "Technology" },
            { id: 2, name: "Healthcare" },
            { id: 3, name: "Finance" },
            { id: 4, name: "Education" },
            { id: 5, name: "Manufacturing" }
        ]);
    }, []);

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
        if (name === "email") setEmailError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, profilePic: file }));
    };

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleJobOptionChange = (e) => {
        setFormData((prevData) => ({ 
            ...prevData, 
            jobOption: e.target.value,
            profilePic: null,
            industry: "",
            currOrganizationName: "",
            city: "",
            jobid: "",
            college: "",
            branch: ""
        }));
        setEmailError("");
    };

    const checkRecruiterEmail = useCallback(async (email) => {
        if (!email || formData.jobOption !== "Employer") return;
        setEmailValidating(true);
        setEmailError("");
        try {
            const response = await axios.post(`${URL}/users/check-Recruteremail`, { email });
            if (response.data && response.data.exists === false) {
                setEmailError("");
            } else if (response.data && response.data.error) {
                setEmailError(String(response.data.error));
            }
        } catch (error) {
            if (error.response?.data?.error) {
                setEmailError(String(error.response.data.error));
            } else if (error.response?.data?.message) {
                setEmailError(String(error.response.data.message));
            } else {
                setEmailError("Failed to validate email. Please try again.");
            }
        } finally {
            setEmailValidating(false);
        }
    }, [formData.jobOption]);

    useEffect(() => {
        if (formData.jobOption === "Employer" && formData.email) {
            const timeoutId = setTimeout(() => {
                checkRecruiterEmail(formData.email);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [formData.email, formData.jobOption, checkRecruiterEmail]);

    const isEmployerOrInvestor = formData.jobOption === "Employer" || formData.jobOption === "Investor";
    const isPlacementOrAcademy = formData.jobOption === "placementDrive" || formData.jobOption === "Academy";

    const handleRegister = async (e) => {
        e.preventDefault();
        if (emailError) {
            setAlert({
                show: true,
                message: "Please fix the email error before submitting.",
                severity: "error"
            });
            return;
        }
        setLoading(true);
        try {
            let endpoint;
            let payload = {};

            if (isEmployerOrInvestor) {
                endpoint = `${URL}/users/signup/user`;
                payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password,
                    jobOption: formData.jobOption,
                    jobid: formData.jobid,
                    industry: formData.industry,
                    currOrganizationName: formData.currOrganizationName,
                    city: formData.city
                };

                if (formData.profilePic) {
                    const formDataWithFile = new FormData();
                    Object.entries(payload).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== "") {
                            formDataWithFile.append(key, value);
                        }
                    });
                    formDataWithFile.append('profilePic', formData.profilePic, formData.profilePic.name);
                    payload = formDataWithFile;
                }
            } else if (isPlacementOrAcademy) {
                endpoint = `${URL}/auth/signup/placement`;
                payload = {
                    firstname: formData.firstName,
                    lastname: formData.lastName,
                    jobOption: formData.jobOption,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    jobid: formData.jobid,
                    college: formData.college,
                    branch: formData.branch
                };   
            }
            
            const response = await axios.post(endpoint, payload);

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setAlert({
                    show: true,
                    message: response.data || "Registration successful. Please check your email to verify your account.",
                    severity: "success"
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
            setAlert({
                show: true,
                message: String(errorMessage),
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const renderConditionalFields = () => {
        if (isEmployerOrInvestor) {
            return (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: '#f8f9ff'
                            },
                            ...(formData.profilePic && {
                                borderColor: '#4caf50',
                                backgroundColor: '#f1f8e9'
                            })
                        }}
                    >
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-pic-upload"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profile-pic-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                {formData.profilePic ? (
                                    <>
                                        <InsertDriveFile sx={{ fontSize: 40, color: '#4caf50' }} />
                                        <Typography variant="body2" color="success.main" fontWeight="medium">
                                            {formData.profilePic.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Click to change file
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <CloudUpload sx={{ fontSize: 40, color: '#1976d2' }} />
                                        <Typography variant="body2" color="primary" fontWeight="medium">
                                            Upload Profile Picture
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Click to select an image file
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </label>
                    </Paper>

                    <FormControl fullWidth required>
                        <InputLabel id="industry-label">Industry</InputLabel>
                        <Select
                            labelId="industry-label"
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            label="Industry"
                            onChange={handleChange}
                            sx={{
                                borderRadius: "8px",
                            }}
                        >
                            {industries.map((industry) => (
                                <MenuItem key={industry.id} value={industry.name}>
                                    {industry.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField 
                        label="Job ID"
                        name="jobid"
                        value={formData.jobid}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                    />

                    <TextField 
                        label="Current Organization"
                        name="currOrganizationName"
                        value={formData.currOrganizationName}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="city-label">City</InputLabel>
                        <Select
                            labelId="city-label"
                            id="city"
                            name="city"
                            value={formData.city}
                            label="City"
                            onChange={handleChange}
                            sx={{
                                borderRadius: "8px",
                            }}
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.name}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            );
        }

        if (isPlacementOrAcademy) {
            return (
                <>
                    <TextField 
                        label="Job ID"
                        name="jobid"
                        value={formData.jobid}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                    />

                    <TextField 
                        label="College"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                    />

                    <TextField 
                        label="Branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                    />
                </>
            );
        }
        return null;
    };

    if (success) {
        return (
            <Container
                maxWidth={false}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
                    minHeight: "100vh",
                    height: { xs: "100vh", sm: "100vh", md: "100vh", lg: "auto" },
                    width: { xs: "100vw", sm: "100vw", md: "100vw", lg: "auto" },
                    p: { xs: 0, sm: 0, md: 0, lg: 2 },
                    overflow: { xs: "hidden", sm: "hidden", md: "hidden", lg: "auto" }
                }}
            >
                <Box
                    sx={{
                        height: { xs: "100vh", sm: "100vh", md: "100vh", lg: "95vh" },
                        width: { xs: "100vw", sm: "100vw", md: "100vw", lg: "85%", xl: "75%" },
                        maxWidth: { lg: "1200px" },
                        bgcolor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: { xs: 0, sm: 0, md: 0, lg: 3 },
                        overflow: "hidden",
                        boxSizing: "border-box",
                        filter: { lg: "drop-shadow(4px 4px 4px rgba(0,0,0,0.7))" },
                        textAlign: "center",
                        p: 4
                    }}
                >
                    <DotLottieReact 
                        src={successAnimation} 
                        loop 
                        autoplay 
                        style={{ width: 300, height: 300 }} 
                    />
                    <Typography variant="h4" sx={{ mt: 2, mb: 3, color: "#1976d2" }}>
                        {alert.message}
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={() => navigate('/login')}
                        sx={{
                            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
                            py: 1.5,
                            px: 4,
                            fontSize: "18px",
                            fontWeight: "700",
                            borderRadius: "8px",
                            textTransform: "none"
                        }}
                    >
                        Go to Login
                    </Button>
                </Box>
            </Container>
        );
    }
    
    return (
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
            minHeight: "100vh",
            height: { xs: "100vh", sm: "100vh", md: "100vh", lg: "auto" },
            width: { xs: "100vw", sm: "100vw", md: "100vw", lg: "auto" },
            p: { xs: 0, sm: 0, md: 0, lg: 2 },
            overflow: { xs: "hidden", sm: "hidden", md: "hidden", lg: "auto" }
          }}
        >
            <Box
              sx={{
                height: { xs: "100vh", sm: "100vh", md: "100vh", lg: "95vh" },
                width: { xs: "100vw", sm: "100vw", md: "100vw", lg: "85%", xl: "75%" },
                maxWidth: { lg: "1200px" },
                bgcolor: "white",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                borderRadius: { xs: 0, sm: 0, md: 0, lg: 3 },
                overflow: "hidden",
                boxSizing: "border-box",
                filter: { lg: "drop-shadow(4px 4px 4px rgba(0,0,0,0.7))" },
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
                            />
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
                    my: { lg: 2 },
                    overflow: "auto"
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
                      component="img"
                      src="/wezumelogo.png"
                      alt="Wezume Logo"
                      loading="lazy"
                      sx={{
                        width: { xs: 100, sm: 120, md: 120, lg: 140 },
                        height: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.2))",
                        mb: 2
                      }}
                    />

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
                      component="form"
                      onSubmit={handleRegister}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: { xs: 1.5, md: 2 },
                        width: "100%",
                        maxWidth: { xs: "90%", sm: "400px", md: "450px", lg: "380px" },
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
                                required
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
                                required
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                            />
                        </Box>
                        
                        <TextField 
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                        />
                        
                        <Box sx={{ width: "100%" }}>
                            <TextField 
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!emailError}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: emailValidating && (
                                            <InputAdornment position="end">
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        border: '2px solid #ccc',
                                                        borderTop: '2px solid #1976d2',
                                                        borderRadius: '50%',
                                                        animation: 'spin 1s linear infinite',
                                                        '@keyframes spin': {
                                                            '0%': { transform: 'rotate(0deg)' },
                                                            '100%': { transform: 'rotate(360deg)' },
                                                        },
                                                    }}
                                                />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                            {emailError && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mt: 0.5, 
                                        fontSize: '0.75rem',
                                        backgroundColor: '#ffeaea',
                                        color: '#c62828',
                                        '& .MuiAlert-icon': { color: '#c62828' }
                                    }}
                                >
                                    {emailError}
                                </Alert>
                            )}
                        </Box>
                        
                        <TextField 
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
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
                        
                        <FormControl fullWidth required>
                            <InputLabel id="job-option-label">Job Option</InputLabel>
                            <Select
                              labelId="job-option-label"
                              id="jobOption"
                              name="jobOption"
                              value={formData.jobOption}
                              label="Job Option"
                              onChange={handleJobOptionChange}
                              sx={{
                                borderRadius: "8px",
                              }}
                            >
                                <MenuItem value="Employer">Employer</MenuItem>
                                <MenuItem value="Investor">Investor</MenuItem>
                                <MenuItem value="placementDrive">Placement Drive</MenuItem>
                                <MenuItem value="Academy">Academy</MenuItem>
                            </Select>
                        </FormControl>

                        {renderConditionalFields()}
                        
                        <Button 
                            fullWidth
                            type="submit"
                            variant="contained" 
                            disableElevation 
                            disabled={loading || !formData.jobOption || emailValidating || !!emailError}
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
                              "&:disabled": {
                                opacity: 0.6,
                              },
                            }}
                        >
                            {loading ? "Registering..." : "Register"}
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