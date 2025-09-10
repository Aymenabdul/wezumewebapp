import { lazy, useState } from "react";
import {
    Box,
    Card,
    Container,
    Grid,
    IconButton,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import WorkIcon from '@mui/icons-material/Work';
import { useAppStore } from "../store/appStore";
import { useNavigate } from 'react-router-dom';

const LineGraph = lazy(() => import("../components/dashboard/LineGraph"));
const BarGraph = lazy(() => import("../components/dashboard/BarGraph"));

export default function Dashboard() {
    const { likedVideos, userDetails } = useAppStore();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    
    const handleJobPostingsClick = () => {
        if (!userDetails?.jobid) {
            setSnackbar({ 
                open: true, 
                message: 'You have no job ID assigned to your profile', 
                severity: 'warning' 
            });
            return;
        }
        navigate(`/app/videos?jobid=${userDetails.jobid}`);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    
    return (
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            px: { xs: 2, md: 3 },
            pb: 2
          }}
        >
            <Box
              sx={{
                height: "64px",
                width: "100%",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                mb: 2
              }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dashboard
                </Typography>
            </Box>
            
            <Grid
              container
              spacing={3}
              sx={{
                width: "100%",
                maxWidth: "1200px"
              }}
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: "fit-content",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >  
                        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                          Monthly Confidence Score Trend
                        </Typography>
                        <LineGraph />
                    </Card>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: "fit-content",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >  
                        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                          Confidence Score Comparison
                        </Typography>
                        <BarGraph />
                    </Card>
                </Grid>
            </Grid>

            <Card
              variant="outlined"
              sx={{
                width: "100%",
                maxWidth: "1200px",
                mt: 3,
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
              }}
            >
                <Box sx={{ p: 3, pb: 2 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={600}
                      sx={{ 
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        mb: 1
                      }}
                    >
                      My Activity
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#64748b",
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      Track your engagement and contributions
                    </Typography>
                </Box>

                <Box sx={{ px: 3, pb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card
                              component="a"
                              href="/app/liked"
                              sx={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                background: "#ffffff",
                                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                display: "block",
                                cursor: "pointer",
                                "&:hover": {
                                  boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                                  transform: "translateY(-2px)",
                                  backgroundColor: "#f8fafc"
                                }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 3,
                                    gap: 2
                                  }}
                                >
                                    <Box
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)"
                                      }}
                                    >
                                        <FavoriteIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                                    </Box>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', sm: '1.125rem' },
                                            color: "#1e293b"
                                          }}
                                        >
                                            Liked Videos
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#64748b",
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                          }}
                                        >
                                            {likedVideos?.length || 0} videos liked
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                        
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card
                              component="a"
                              href="#"
                              sx={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                background: "#ffffff",
                                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                display: "block",
                                cursor: "pointer",
                                "&:hover": {
                                  boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                                  transform: "translateY(-2px)",
                                  backgroundColor: "#f8fafc"
                                }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 3,
                                    gap: 2
                                  }}
                                >
                                    <Box
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                                      }}
                                    >
                                        <CommentIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                                    </Box>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', sm: '1.125rem' },
                                            color: "#1e293b"
                                          }}
                                        >
                                            Commented Videos
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#64748b",
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                          }}
                                        >
                                            23 videos commented
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                        
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card
                              onClick={handleJobPostingsClick}
                              sx={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                background: "#ffffff",
                                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                display: "block",
                                cursor: "pointer",
                                "&:hover": {
                                  boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                                  transform: "translateY(-2px)",
                                  backgroundColor: "#f8fafc"
                                }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 3,
                                    gap: 2
                                  }}
                                >
                                    <Box
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                                      }}
                                    >
                                        <WorkIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                                    </Box>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', sm: '1.125rem' },
                                            color: "#1e293b"
                                          }}
                                        >
                                            Job Postings
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#64748b",
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                          }}
                                        >
                                            {userDetails?.jobid ? `Job ID: ${userDetails.jobid}` : 'No job assigned'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}