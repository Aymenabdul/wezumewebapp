/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Typography,
  Collapse,
  Snackbar,
  Alert
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import axiosInstance from '../axios/axios';
import { useAppStore } from '../store/appStore';
import VideoCard from '../components/videos/VideoCard';
import VideoSkeleton from '../components/videos/VideoSkeleton';

const Videos = () => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [filters, setFilters] = useState({
    keyWords: '',
    keyskills: '',
    experience: '',
    industry: '',
    city: '',
    college: '',
    jobid: ''
  });

  const { 
    userDetails, 
    videos, 
    isLoadingVideos, 
    videoError, 
    getVideos 
  } = useAppStore();

  useEffect(() => {
    if (userDetails) {
      fetchVideos();
    }
  }, [userDetails]);

  useEffect(() => {
    if (!isLoadingVideos && videos.length > 0) {
      const timeoutId = setTimeout(() => {
        applyFilters();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [filters, videos, isLoadingVideos]);

  const fetchVideos = async () => {
    try {
      const videoData = await getVideos();
      setFilteredVideos(videoData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      showSnackbar('Failed to fetch videos', 'error');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = async () => {
    const hasFilters = Object.values(filters).some(val => val.trim() !== '');
    
    if (!hasFilters) {
      setFilteredVideos(videos);
      return;
    }

    try {
      setFilterLoading(true);
      const filterData = {
        keyWords: filters.keyWords,
        keyskills: filters.keyskills,
        experience: filters.experience,
        industry: filters.industry,
        city: filters.city,
        college: filters.college,
        jobid: filters.jobid
      };

      const response = await axiosInstance.post('/videos/filter', filterData);
      
      if (response.data && response.data.length > 0) {
        setFilteredVideos(response.data);
        showSnackbar(`Found ${response.data.length} videos matching your filters`, 'success');
      } else {
        setFilteredVideos([]);
        showSnackbar('No videos found matching your filters', 'warning');
      }
    } catch (error) {
      setFilteredVideos(videos);
      showSnackbar('Error applying filters. Please try again.', 'error');
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      keyWords: '',
      keyskills: '',
      experience: '',
      industry: '',
      city: '',
      college: '',
      jobid: ''
    });
    showSnackbar('Filters cleared', 'info');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<FilterList />}
          endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Filters
        </Button>

        <Collapse in={filtersOpen}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Filter Videos</Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Keywords"
                  value={filters.keyWords}
                  onChange={(e) => handleFilterChange('keyWords', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key Skills"
                  value={filters.keyskills}
                  onChange={(e) => handleFilterChange('keyskills', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
                    label="Experience"
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="0-1">0-1 years</MenuItem>
                    <MenuItem value="1-3">1-3 years</MenuItem>
                    <MenuItem value="3-5">3-5 years</MenuItem>
                    <MenuItem value="5+">5+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={filters.industry}
                    label="Industry"
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="tech">Technology</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="healthcare">Healthcare</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                    <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>City</InputLabel>
                  <Select
                    value={filters.city}
                    label="City"
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="bangalore">Bangalore</MenuItem>
                    <MenuItem value="mumbai">Mumbai</MenuItem>
                    <MenuItem value="delhi">Delhi</MenuItem>
                    <MenuItem value="chennai">Chennai</MenuItem>
                    <MenuItem value="pune">Pune</MenuItem>
                    <MenuItem value="hyderabad">Hyderabad</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="College"
                  value={filters.college}
                  onChange={(e) => handleFilterChange('college', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Job ID"
                  value={filters.jobid}
                  onChange={(e) => handleFilterChange('jobid', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={applyFilters}
                disabled={filterLoading}
              >
                {filterLoading ? 'Applying...' : 'Apply Filters'}
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Clear All
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      <Grid container spacing={0.7}>
        {isLoadingVideos ? (
          Array(12).fill().map((_, index) => (
            <Grid size={{ xs: 4, lg: 3 }} key={index}>
              <VideoSkeleton />
            </Grid>
          ))
        ) : (
          filteredVideos.map((video) => (
            <Grid size={{ xs: 4, lg: 3 }} key={video.id}>
              <VideoCard video={video} />
            </Grid>
          ))
        )}
      </Grid>

      {!isLoadingVideos && filteredVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {Object.values(filters).some(val => val.trim() !== '') 
              ? 'No videos found matching your filters' 
              : 'No videos available'
            }
          </Typography>
        </Box>
      )}

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
    </Box>
  );
};

export default Videos;