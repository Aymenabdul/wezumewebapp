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

const LineGraph = lazy(() => import("../components/LineGraph"));
const BarGraph = lazy(() => import("../components/BarGraph"));

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

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
                maxWidth: "1200px"
              }}
            >
                <Typography 
                  variant="h5" 
                  fontWeight={500}
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                  My Activity
                </Typography>
                <Box 
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #e0e0e0",
                  }}>
                    <Box
                      onClick={() => handleSectionToggle('liked')}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        py: 2,
                        px: { xs: 1, sm: 0 },
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5"
                        },
                        transition: "background-color 0.2s ease"
                      }}
                    >
                        <Typography
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                            <FavoriteIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            Liked Videos
                        </Typography>
                        <IconButton size="small">
                            {expandedSection === 'liked' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={expandedSection === 'liked'}>
                        <Box sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 2, sm: 0 }
                            }}>
                                <Typography 
                                  variant="body2"
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Total liked videos: 47
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={<LaunchIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRedirect('liked-videos');
                                    }}
                                    sx={{
                                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                        color: "white",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        minWidth: 'fit-content',
                                        "&:hover": {
                                            background: "linear-gradient(45deg, #1976D2 30%, #1BA3D1 90%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                                        },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    View All
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
                
                <Box 
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #e0e0e0",
                  }}>
                    <Box
                      onClick={() => handleSectionToggle('commented')}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        py: 2,
                        px: { xs: 1, sm: 0 },
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5"
                        },
                        transition: "background-color 0.2s ease"
                      }}
                    >
                        <Typography
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                            <CommentIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            Commented Videos
                        </Typography>
                        <IconButton size="small">
                            {expandedSection === 'commented' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={expandedSection === 'commented'}>
                        <Box sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 2, sm: 0 }
                            }}>
                                <Typography 
                                  variant="body2"
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Total commented videos: 23
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={<LaunchIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRedirect('commented-videos');
                                    }}
                                    sx={{
                                        background: "linear-gradient(45deg, #FF6B35 30%, #FF8E53 90%)",
                                        boxShadow: "0 3px 5px 2px rgba(255, 107, 53, .3)",
                                        color: "white",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        minWidth: 'fit-content',
                                        "&:hover": {
                                            background: "linear-gradient(45deg, #E55A2B 30%, #E67A41 90%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 10px 2px rgba(255, 107, 53, .3)",
                                        },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    View All
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
                
                <Box 
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #e0e0e0",
                  }}>
                    <Box
                      onClick={() => handleSectionToggle('jobs')}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        py: 2,
                        px: { xs: 1, sm: 0 },
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5"
                        },
                        transition: "background-color 0.2s ease"
                      }}
                    >
                        <Typography
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                            <WorkIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            Job Postings
                        </Typography>
                        <IconButton size="small">
                            {expandedSection === 'jobs' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={expandedSection === 'jobs'}>
                        <Box sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 2, sm: 0 }
                            }}>
                                <Typography 
                                  variant="body2"
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Total job postings: 12
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={<LaunchIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRedirect('job-postings');
                                    }}
                                    sx={{
                                        background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
                                        boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                                        color: "white",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        minWidth: 'fit-content',
                                        "&:hover": {
                                            background: "linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 10px 2px rgba(76, 175, 80, .3)",
                                        },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    View All
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Container>
    );
};