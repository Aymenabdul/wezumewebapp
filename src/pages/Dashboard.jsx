import { lazy, useState } from "react";
import {
    Box,
    Button,
    Card,
    Collapse,
    Container,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import WorkIcon from '@mui/icons-material/Work';
import LaunchIcon from '@mui/icons-material/Launch';

const LineGraph = lazy(() => import("../components/dashboard/LineGraph"));
const BarGraph = lazy(() => import("../components/dashboard/BarGraph"));

export default function Dashboard() {
    const [expandedSection, setExpandedSection] = useState(null);

    const handleSectionToggle = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleRedirect = (page) => {
        console.log(`Redirecting to ${page}`);
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
                    {/* Liked Videos Section */}
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                        <Box
                          onClick={() => handleSectionToggle('liked')}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 3,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f8fafc"
                            },
                            transition: "background-color 0.2s ease"
                          }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                <Box>
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
                                        47 videos liked
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton 
                              size="small"
                              sx={{
                                backgroundColor: "#f1f5f9",
                                "&:hover": { backgroundColor: "#e2e8f0" }
                              }}
                            >
                                {expandedSection === 'liked' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                        <Collapse in={expandedSection === 'liked'}>
                            <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: { xs: 2, sm: 0 },
                                  p: 2,
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0"
                                }}>
                                    <Typography 
                                      variant="body1"
                                      sx={{ 
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        color: "#374151",
                                        fontWeight: 500
                                      }}
                                    >
                                        View and manage all your liked content
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<LaunchIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRedirect('liked-videos');
                                        }}
                                        sx={{
                                            background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                            boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
                                            color: "white",
                                            fontWeight: 600,
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            px: 3,
                                            py: 1,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            minWidth: 'fit-content',
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 16px rgba(236, 72, 153, 0.4)",
                                            },
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Card>
                    
                    {/* Commented Videos Section */}
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                        <Box
                          onClick={() => handleSectionToggle('commented')}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 3,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f8fafc"
                            },
                            transition: "background-color 0.2s ease"
                          }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                <Box>
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
                            <IconButton 
                              size="small"
                              sx={{
                                backgroundColor: "#f1f5f9",
                                "&:hover": { backgroundColor: "#e2e8f0" }
                              }}
                            >
                                {expandedSection === 'commented' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                        <Collapse in={expandedSection === 'commented'}>
                            <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: { xs: 2, sm: 0 },
                                  p: 2,
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0"
                                }}>
                                    <Typography 
                                      variant="body1"
                                      sx={{ 
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        color: "#374151",
                                        fontWeight: 500
                                      }}
                                    >
                                        Review your comments and discussions
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<LaunchIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRedirect('commented-videos');
                                        }}
                                        sx={{
                                            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                                            color: "white",
                                            fontWeight: 600,
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            px: 3,
                                            py: 1,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            minWidth: 'fit-content',
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 16px rgba(245, 158, 11, 0.4)",
                                            },
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Card>
                    
                    {/* Job Postings Section */}
                    <Card
                      sx={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                        <Box
                          onClick={() => handleSectionToggle('jobs')}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 3,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f8fafc"
                            },
                            transition: "background-color 0.2s ease"
                          }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                <Box>
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
                                        12 job opportunities
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton 
                              size="small"
                              sx={{
                                backgroundColor: "#f1f5f9",
                                "&:hover": { backgroundColor: "#e2e8f0" }
                              }}
                            >
                                {expandedSection === 'jobs' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                        <Collapse in={expandedSection === 'jobs'}>
                            <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: { xs: 2, sm: 0 },
                                  p: 2,
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0"
                                }}>
                                    <Typography 
                                      variant="body1"
                                      sx={{ 
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        color: "#374151",
                                        fontWeight: 500
                                      }}
                                    >
                                        Manage your job listings and applications
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<LaunchIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRedirect('job-postings');
                                        }}
                                        sx={{
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                                            color: "white",
                                            fontWeight: 600,
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            px: 3,
                                            py: 1,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            minWidth: 'fit-content',
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                                            },
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Card>
                </Box>
            </Card>
        </Container>
    );
};