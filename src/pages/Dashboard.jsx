/* eslint-disable no-unused-vars */
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
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import { useAppStore } from "../store/appStore";
import VideoCard from "../components/videos/VideoCard";
import axiosInstance from '../axios/axios';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);
            
            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

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
    const [countsData, setCountsData] = useState({ totalUsers: 0, totalVideos: 0 });
    const [loadingCounts, setLoadingCounts] = useState(false);

    const isPlacementOrAcademy = userDetails?.jobOption === 'placementDrive' || 
                                 userDetails?.jobOption === 'Academy';

    const fetchCounts = async () => {
        if (!isPlacementOrAcademy || !userDetails?.jobid) {
            return;
        }
        
        setLoadingCounts(true);
        try {
            const response = await axiosInstance.get(`/videos/counts/${userDetails.jobid}`);
            setCountsData(response.data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to load counts data',
                severity: 'error'
            });
            setCountsData({ totalUsers: 0, totalVideos: 0 });
        } finally {
            setLoadingCounts(false);
        }
    };

    useEffect(() => {
        if (!initialized && userDetails) {
            const defaultTab = isPlacementOrAcademy ? 'job' : 'liked';
            setActiveTab(defaultTab);
            loadTabData(defaultTab);
            
            if (isPlacementOrAcademy) {
                fetchCounts();
            }
            
            setInitialized(true);
        }
    }, [initialized, isPlacementOrAcademy, userDetails]);

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
                if (!userDetails?.jobid && !isPlacementOrAcademy) {
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
                    if (!userDetails?.jobid && !isPlacementOrAcademy) {
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
                return isPlacementOrAcademy ? 'Job Videos' : `Job Videos${userDetails?.jobid ? ` (Job ID: ${userDetails.jobid})` : ''}`;
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
                return (userDetails?.jobid || isPlacementOrAcademy) ? (videos?.length || 0) : 0;
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

    const renderTabCards = () => {
        if (isPlacementOrAcademy) {
            return (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          onClick={() => handleTabClick('job')}
                          sx={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            height: { xs: 100, sm: 120, md: 140 },
                            "&:hover": {
                              boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                              transform: { xs: "none", md: "translateY(-2px)" }
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
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
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2,
                                        mb: 0.5
                                      }}
                                    >
                                        Job Videos
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#16a34a",
                                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                                        fontWeight: 600
                                      }}
                                    >
                                        {videos?.length || 0} videos
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          sx={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)",
                            boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)",
                            height: { xs: 100, sm: 120, md: 140 },
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
                                  }}
                                >
                                    <PeopleIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2,
                                        mb: 0.5
                                      }}
                                    >
                                        Total Students
                                    </Typography>
                                    {loadingCounts ? (
                                        <CircularProgress 
                                            size={16} 
                                            sx={{ 
                                                color: "#a855f7"
                                            }} 
                                        />
                                    ) : (
                                        <Typography
                                          variant="h5"
                                          sx={{
                                            color: "#a855f7",
                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                                            fontWeight: 700
                                          }}
                                        >
                                            <AnimatedCounter 
                                                end={countsData.totalUsers} 
                                                duration={2500} 
                                            />
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          sx={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                            height: { xs: 100, sm: 120, md: 140 },
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                                  }}
                                >
                                    <PlayCircleOutlineIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2,
                                        mb: 0.5
                                      }}
                                    >
                                        Total Videos
                                    </Typography>
                                    {loadingCounts ? (
                                        <CircularProgress 
                                            size={16} 
                                            sx={{ 
                                                color: "#3b82f6"
                                            }} 
                                        />
                                    ) : (
                                        <Typography
                                          variant="h5"
                                          sx={{
                                            color: "#3b82f6",
                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                                            fontWeight: 700
                                          }}
                                        >
                                            <AnimatedCounter 
                                                end={countsData.totalVideos} 
                                                duration={2000} 
                                            />
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            );
        } else {
            return (
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
                            height: { xs: 100, sm: 120, md: 140 },
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
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
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Liked Videos
                                    </Typography>
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
                            height: { xs: 100, sm: 120, md: 140 },
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
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
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Commented Videos
                                    </Typography>
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
                            height: { xs: 100, sm: 120, md: 140 },
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
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                gap: { xs: 1, sm: 1.5, md: 2 }
                              }}
                            >
                                <Box
                                  sx={{
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
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
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        color: "#1e293b",
                                        lineHeight: 1.2
                                      }}
                                    >
                                        Job Videos
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            );
        }
    };
    
    if (!userDetails) {
        return (
            <Container maxWidth={false} sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Container>
        );
    }
    
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
                {renderTabCards()}
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
                                        {activeTab === 'job' && (!userDetails?.jobid && !isPlacementOrAcademy ? "No job ID assigned to your profile" : "No videos available for this job")}
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
