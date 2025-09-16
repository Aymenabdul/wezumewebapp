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
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import WorkIcon from '@mui/icons-material/Work';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppStore } from "../store/appStore";
import VideoCard from "../components/videos/VideoCard";



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
        isLoadingMoreVideos,
        hasMoreVideos,
        jobVideosCounts,
        isLoadingJobVideosCounts,
        getLikedVideos,
        getComments,
        getVideos,
        loadMoreVideos,
        getJobVideosCounts
    } = useAppStore();
    
    const [activeTab, setActiveTab] = useState('liked');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [displayVideos, setDisplayVideos] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [showStudentTable, setShowStudentTable] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('C191');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('name');



    const isPlacementOrAcademy = userDetails?.jobOption === 'placementDrive' || 
                                 userDetails?.jobOption === 'Academy';

    const studentData = [
        { id: 1, name: 'Arjun Sharma', email: 'arjun.sharma@email.com', jobId: 'C191' },
        { id: 2, name: 'Priya Patel', email: 'priya.patel@email.com', jobId: 'C191' },
        { id: 3, name: 'Rahul Kumar', email: 'rahul.kumar@email.com', jobId: 'C191' },
        { id: 4, name: 'Anita Singh', email: 'anita.singh@email.com', jobId: 'C191' },
        { id: 5, name: 'Vikram Gupta', email: 'vikram.gupta@email.com', jobId: 'C191' },
        { id: 6, name: 'Meera Reddy', email: 'meera.reddy@email.com', jobId: 'C191' },
        { id: 7, name: 'Suresh Yadav', email: 'suresh.yadav@email.com', jobId: 'C191' },
        { id: 8, name: 'Kavya Nair', email: 'kavya.nair@email.com', jobId: 'C191' },
        { id: 9, name: 'Raj Malhotra', email: 'raj.malhotra@email.com', jobId: 'C191' },
        { id: 10, name: 'Deepika Jain', email: 'deepika.jain@email.com', jobId: 'C191' },
        { id: 11, name: 'Amit Gupta', email: 'amit.gupta@email.com', jobId: 'C191' },
        { id: 12, name: 'Sneha Sharma', email: 'sneha.sharma@email.com', jobId: 'C191' },
        { id: 13, name: 'Ravi Kumar', email: 'ravi.kumar@email.com', jobId: 'C191' },
        { id: 14, name: 'Pooja Singh', email: 'pooja.singh@email.com', jobId: 'C191' },
        { id: 15, name: 'Kiran Patel', email: 'kiran.patel@email.com', jobId: 'C191' },
    ];

    const sortedStudentData = [...studentData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };


    const handleScroll = () => {
        if (activeTab !== 'job' || !hasMoreVideos || isLoadingMoreVideos) {
            return;
        }


        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.offsetHeight;


        if (scrollTop + windowHeight >= documentHeight - 1000) {
            loadMoreVideos();
        }
    };


    useEffect(() => {
        if (activeTab === 'job') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [activeTab, hasMoreVideos, isLoadingMoreVideos]);



    useEffect(() => {
        if (!initialized && userDetails) {
            const defaultTab = isPlacementOrAcademy ? 'job' : 'liked';
            setActiveTab(defaultTab);
            
            if (isPlacementOrAcademy) {
                getJobVideosCounts();
            }
            
            setInitialized(true);
        }
    }, [initialized, isPlacementOrAcademy, userDetails]);


    useEffect(() => {
        if (initialized) {
            loadTabData(activeTab);
        }
    }, [initialized, activeTab]);



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
                if (isPlacementOrAcademy || userDetails?.jobid) {
                    setDisplayVideos(videos || []);
                } else {
                    setDisplayVideos([]);
                }
                break;
            default:
                setDisplayVideos([]);
        }
    };



    const loadTabData = async (tab) => {
        try {
            switch (tab) {
                case 'liked':
                    await getLikedVideos();
                    break;
                case 'commented':
                    await getComments();
                    await getVideos();
                    break;
                case 'job':
                    if (!userDetails?.jobid && !isPlacementOrAcademy) {
                        setSnackbar({ 
                            open: true, 
                            message: 'You have no job ID assigned to your profile', 
                            severity: 'warning' 
                        });
                        return;
                    }
                    if (isPlacementOrAcademy || userDetails?.jobid) {
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
        }
    };



    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setShowStudentTable(false);
        }
    };

    const handleFilterCardClick = () => {
        setShowStudentTable(false);
    };

    const handleStudentCardClick = () => {
        setShowStudentTable(true);
    };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
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
                return videos?.length || 0;
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
                          onClick={handleFilterCardClick}
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
                                    <FilterListIcon sx={{ 
                                      color: "white", 
                                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                    }} />
                                </Box>
                                <FormControl size="small" sx={{ minWidth: 110 }}>
                                    <Select
                                        value={selectedFilter}
                                        onChange={handleFilterChange}
                                        displayEmpty
                                        size="small"
                                        IconComponent={KeyboardArrowDownIcon}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                                            '& .MuiSelect-select': {
                                                padding: '8px 12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: '#059669',
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#10b981',
                                                borderWidth: '2px',
                                                borderRadius: '10px',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#059669',
                                                borderWidth: '2px',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#10b981',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                                            },
                                            '& .MuiSelect-icon': {
                                                color: '#059669',
                                                fontSize: '1.2rem',
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                    border: '1px solid #e5e7eb',
                                                    mt: 1,
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem 
                                            value="C191" 
                                            sx={{ 
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                color: '#374151',
                                                '&:hover': {
                                                    backgroundColor: '#ecfdf5',
                                                    color: '#059669',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#d1fae5',
                                                    color: '#059669',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: '#a7f3d0',
                                                    }
                                                }
                                            }}
                                        >
                                            C191
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 4, md: 4 }}>
                        <Card
                          onClick={handleStudentCardClick}
                          sx={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)",
                            boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            height: { xs: 100, sm: 120, md: 140 },
                            "&:hover": {
                              boxShadow: "0 6px 16px rgba(168, 85, 247, 0.4)",
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
                                    {isLoadingJobVideosCounts ? (
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
                                                end={jobVideosCounts.totalUsers} 
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
                                    {isLoadingJobVideosCounts ? (
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
                                                end={jobVideosCounts.totalVideos} 
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
                {showStudentTable ? (
                    <Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    mb: 1
                                }}
                            >
                                Student Details
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: "#64748b"
                                }}
                            >
                                {studentData.length} student{studentData.length !== 1 ? 's' : ''} enrolled
                            </Typography>
                        </Box>
                        <TableContainer 
                            component={Paper} 
                            sx={{ 
                                maxHeight: 500,
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow sx={{ 
                                        background: 'radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)',
                                        '& th': {
                                            borderBottom: 'none'
                                        }
                                    }}>
                                        <TableCell sx={{ 
                                            background: 'transparent',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            padding: '16px',
                                        }}>
                                            <TableSortLabel
                                                active={sortBy === 'name'}
                                                direction={sortBy === 'name' ? sortOrder : 'asc'}
                                                onClick={() => handleSort('name')}
                                                sx={{ 
                                                    color: 'white !important',
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'white !important',
                                                    }
                                                }}
                                            >
                                                Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sx={{ 
                                            background: 'transparent',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            padding: '16px',
                                        }}>
                                            <TableSortLabel
                                                active={sortBy === 'email'}
                                                direction={sortBy === 'email' ? sortOrder : 'asc'}
                                                onClick={() => handleSort('email')}
                                                sx={{ 
                                                    color: 'white !important',
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'white !important',
                                                    }
                                                }}
                                            >
                                                Email ID
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sx={{ 
                                            background: 'transparent',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            padding: '16px',
                                        }}>
                                            <TableSortLabel
                                                active={sortBy === 'jobId'}
                                                direction={sortBy === 'jobId' ? sortOrder : 'asc'}
                                                onClick={() => handleSort('jobId')}
                                                sx={{ 
                                                    color: 'white !important',
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'white !important',
                                                    }
                                                }}
                                            >
                                                Job ID
                                            </TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedStudentData.map((student, index) => (
                                        <TableRow 
                                            key={student.id} 
                                            sx={{ 
                                                '&:hover': { 
                                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                                    transform: 'scale(1.01)',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s ease-in-out'
                                                },
                                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                                                transition: 'all 0.2s ease-in-out',
                                                borderBottom: '1px solid #f1f5f9'
                                            }}
                                        >
                                            <TableCell sx={{ 
                                                fontSize: '0.9rem',
                                                padding: '16px',
                                                fontWeight: 500,
                                                color: '#374151'
                                            }}>
                                                {student.name}
                                            </TableCell>
                                            <TableCell sx={{ 
                                                fontSize: '0.9rem',
                                                padding: '16px',
                                                color: '#6b7280'
                                            }}>
                                                {student.email}
                                            </TableCell>
                                            <TableCell sx={{ 
                                                fontSize: '0.9rem',
                                                padding: '16px',
                                                fontWeight: 600,
                                                color: '#10b981'
                                            }}>
                                                {student.jobId}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Box>
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

                        {isCurrentTabLoading() ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
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
                                
                                {isLoadingMoreVideos && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
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