import { useState, useEffect } from "react";
import {
    Box,
    Card,
    Container,
    Typography,
    Snackbar,
    Alert,
    Grid,
    Paper,
    Button,
    CircularProgress
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import WorkIcon from '@mui/icons-material/Work';
import { useAppStore } from "../store/appStore";
import VideoCard from "../components/videos/VideoCard";

export default function Dashboard() {
    const { 
        likedVideos, 
        userDetails, 
        comments,
        videos,
        isLoadingVideos,
        isLoadingLikedVideos,
        isLoadingComments,
        getLikedVideos,
        getComments,
        getVideos
    } = useAppStore();
    
    const [activeTab, setActiveTab] = useState('liked');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [displayVideos, setDisplayVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            loadTabData(activeTab);
            setInitialized(true);
        }
    }, [initialized]);

    useEffect(() => {
        if (initialized) {
            updateDisplayVideos();
        }
    }, [activeTab, likedVideos, comments, videos, initialized]);

    const updateDisplayVideos = () => {
        switch (activeTab) {
            case 'liked':
                setDisplayVideos(likedVideos || []);
                break;
            case 'commented':
                { const commentedVideoIds = [...new Set(comments?.map(c => c.videoId) || [])];
                const commentedVideos = (videos || []).filter(video => 
                    commentedVideoIds.includes(video.id)
                );
                setDisplayVideos(commentedVideos);
                break; }
            case 'job':
                if (!userDetails?.jobid) {
                    setDisplayVideos([]);
                } else {
                    setDisplayVideos(videos || []);
                }
                break;
            default:
                setDisplayVideos([]);
        }
    };

    const loadTabData = async (tab) => {
        setLoading(true);
        try {
            switch (tab) {
                case 'liked':
                    if (!likedVideos || likedVideos.length === 0) {
                        await getLikedVideos();
                    }
                    break;
                case 'commented':
                    if (!comments || comments.length === 0) {
                        await getComments();
                    }
                    if (!videos || videos.length === 0) {
                        await getVideos();
                    }
                    break;
                case 'job':
                    if (!userDetails?.jobid) {
                        setSnackbar({ 
                            open: true, 
                            message: 'You have no job ID assigned to your profile', 
                            severity: 'warning' 
                        });
                        break;
                    }
                    if (!videos || videos.length === 0) {
                        await getVideos();
                    }
                    break;
            }
        } catch (error) {
            console.error('Error loading tab data:', error);
            setSnackbar({ 
                open: true, 
                message: 'Failed to load videos', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            loadTabData(tab);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 'liked':
                return 'Liked Videos';
            case 'commented':
                return 'Commented Videos';
            case 'job':
                return `Job Videos${userDetails?.jobid ? ` (Job ID: ${userDetails.jobid})` : ''}`;
            default:
                return 'Videos';
        }
    };

    const getTabCount = () => {
        switch (activeTab) {
            case 'liked':
                return likedVideos?.length || 0;
            case 'commented':
                return [...new Set(comments?.map(c => c.videoId) || [])].length || 0;
            case 'job':
                return userDetails?.jobid ? (videos?.length || 0) : 0;
            default:
                return 0;
        }
    };

    const isCurrentTabLoading = () => {
        switch (activeTab) {
            case 'liked':
                return isLoadingLikedVideos;
            case 'commented':
                return isLoadingComments || isLoadingVideos;
            case 'job':
                return isLoadingVideos;
            default:
                return false;
        }
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
                justifyContent: "space-between",
                mb: 3
              }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dashboard
                </Typography>
            </Box>

            <Box sx={{ 
                width: "100%", 
                maxWidth: "1200px", 
                mb: 3,
                px: 2
            }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          onClick={() => handleTabClick('liked')}
                          sx={{
                            borderRadius: "12px",
                            border: activeTab === 'liked' ? "2px solid #ec4899" : "1px solid #e2e8f0",
                            background: activeTab === 'liked' ? 
                              "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)" : 
                              "#ffffff",
                            boxShadow: activeTab === 'liked' ? 
                              "0 4px 12px rgba(236, 72, 153, 0.3)" : 
                              "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            minHeight: { xs: 100, sm: 120, md: 140 },
                            "&:hover": {
                              boxShadow: { 
                                xs: activeTab === 'liked' ? 
                                  "0 4px 12px rgba(236, 72, 153, 0.3)" : 
                                  "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                md: "0 4px 12px 0 rgba(0, 0, 0, 0.1)"
                              },
                              transform: { xs: "none", md: "translateY(-2px)" },
                              backgroundColor: activeTab === 'liked' ? 
                                "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)" : 
                                "#f8fafc"
                            }
                          }}
                        >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: { xs: 1.5, sm: 2, md: 3 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 32, sm: 40, md: 48 },
                                    height: { xs: 32, sm: 40, md: 48 },
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)"
                                  }}
                                >
                                    <FavoriteIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.125rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Liked Videos
                                    </Typography>
                                    {/* <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#64748b",
                                        fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                                        mt: 0.5
                                      }}
                                    >
                                        {likedVideos?.length || 0} liked
                                    </Typography> */}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          onClick={() => handleTabClick('commented')}
                          sx={{
                            borderRadius: "12px",
                            border: activeTab === 'commented' ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                            background: activeTab === 'commented' ? 
                              "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : 
                              "#ffffff",
                            boxShadow: activeTab === 'commented' ? 
                              "0 4px 12px rgba(245, 158, 11, 0.3)" : 
                              "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            minHeight: { xs: 100, sm: 120, md: 140 },
                            "&:hover": {
                              boxShadow: { 
                                xs: activeTab === 'commented' ? 
                                  "0 4px 12px rgba(245, 158, 11, 0.3)" : 
                                  "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                md: "0 4px 12px 0 rgba(0, 0, 0, 0.1)"
                              },
                              transform: { xs: "none", md: "translateY(-2px)" },
                              backgroundColor: activeTab === 'commented' ? 
                                "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : 
                                "#f8fafc"
                            }
                          }}
                        >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: { xs: 1.5, sm: 2, md: 3 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 32, sm: 40, md: 48 },
                                    height: { xs: 32, sm: 40, md: 48 },
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                                  }}
                                >
                                    <CommentIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.125rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Commented Videos
                                    </Typography>
                                    {/* <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#64748b",
                                        fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                                        mt: 0.5
                                      }}
                                    >
                                        {[...new Set(comments?.map(c => c.videoId) || [])].length} videos
                                    </Typography> */}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          onClick={() => handleTabClick('job')}
                          sx={{
                            borderRadius: "12px",
                            border: activeTab === 'job' ? "2px solid #10b981" : "1px solid #e2e8f0",
                            background: activeTab === 'job' ? 
                              "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" : 
                              "#ffffff",
                            boxShadow: activeTab === 'job' ? 
                              "0 4px 12px rgba(16, 185, 129, 0.3)" : 
                              "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            minHeight: { xs: 100, sm: 120, md: 140 },
                            "&:hover": {
                              boxShadow: { 
                                xs: activeTab === 'job' ? 
                                  "0 4px 12px rgba(16, 185, 129, 0.3)" : 
                                  "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                                md: "0 4px 12px 0 rgba(0, 0, 0, 0.1)"
                              },
                              transform: { xs: "none", md: "translateY(-2px)" },
                              backgroundColor: activeTab === 'job' ? 
                                "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" : 
                                "#f8fafc"
                            }
                          }}
                        >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: { xs: 1.5, sm: 2, md: 3 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 32, sm: 40, md: 48 },
                                    height: { xs: 32, sm: 40, md: 48 },
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                                  }}
                                >
                                    <WorkIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.125rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Job Videos
                                    </Typography>
                                    {/* <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#64748b",
                                        fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                                        mt: 0.5
                                      }}
                                    >
                                        {userDetails?.jobid ? `ID: ${userDetails.jobid}` : 'No job'}
                                    </Typography> */}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Paper
              sx={{
                width: "100%",
                maxWidth: "1200px",
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600,
                            color: "#1e293b",
                            mb: 1
                        }}
                    >
                        {getTabTitle()}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: "#64748b"
                        }}
                    >
                        {getTabCount()} video{getTabCount() !== 1 ? 's' : ''} found
                    </Typography>
                </Box>

                {(loading || isCurrentTabLoading()) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={0.7}>
                        {displayVideos.length === 0 ? (
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ 
                                    textAlign: 'center', 
                                    py: 6,
                                    color: '#6b7280'
                                }}>
                                    <Typography variant="h6">
                                        No videos found
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {activeTab === 'liked' && "You haven't liked any videos yet"}
                                        {activeTab === 'commented' && "You haven't commented on any videos yet"}
                                        {activeTab === 'job' && (!userDetails?.jobid ? "No job ID assigned to your profile" : "No videos available for this job")}
                                    </Typography>
                                </Box>
                            </Grid>
                        ) : (
                            displayVideos.map((video) => (
                                <Grid size={{ xs: 4, lg: 3 }} key={video.id}>
                                    <VideoCard video={video} />
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </Paper>

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