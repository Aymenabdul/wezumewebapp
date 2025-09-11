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
import { FilterList, ExpandMore, ExpandLess, Refresh } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../axios/axios';
import { useAppStore } from '../store/appStore';
import VideoCard from '../components/videos/VideoCard';
import VideoSkeleton from '../components/videos/VideoSkeleton';

export default function Videos() {
  const [searchParams] = useSearchParams();
  const jobid = searchParams.get('jobid');
  
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [customCity, setCustomCity] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [filters, setFilters] = useState({
    keyWords: '',
    keyskills: '',
    experience: '',
    industry: '',
    city: '',
    college: '',
    jobid: jobid || ''
  });

  const { 
    userDetails, 
    videos, 
    isLoadingVideos, 
    videoError, 
    getVideos,
    refreshVideos
  } = useAppStore();

  const cityOptions = [
    'New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Other'
  ];

  const industryOptions = [
    'Banking & Finance', 'Biotechnology', 'Construction', 'Consumer Goods', 'Education', 'Energy',
    'Healthcare', 'Media & Entertainment', 'Hospitality', 'Information Technology (IT)', 'Insurance',
    'Manufacturing', 'Non-Profit', 'Real Estate', 'Retail', 'Transportation', 'Travel & Tourism',
    'Textiles', 'Logistics & Supply Chain', 'Sports', 'E-commerce', 'Consulting', 'Advertising & Marketing',
    'Architecture', 'Arts & Design', 'Environmental Services', 'Human Resources', 'Legal', 'Management',
    'Telecommunications', 'Other'
  ];

  useEffect(() => {
    if (jobid) {
      setFilters(prev => ({ ...prev, jobid }));
    }
  }, [jobid]);

  useEffect(() => {
    if (userDetails) {
      fetchVideos();
    }
  }, [userDetails, jobid]);

  useEffect(() => {
    if (!isLoadingVideos && videos.length > 0) {
      setFilteredVideos(videos);
    }
  }, [videos, isLoadingVideos]);

  const fetchVideos = async () => {
    try {
      let videoData;
      if (jobid && userDetails?.jobid === jobid) {
        const response = await axiosInstance.get(`/videos/job/${jobid}`);
        videoData = response.data || [];
        setFilteredVideos(videoData);
        showSnackbar(`Loaded ${videoData.length} job-specific videos`, 'success');
      } else {
        videoData = await getVideos();
        setFilteredVideos(videoData);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      showSnackbar('Failed to fetch videos', 'error');
    }
  };

  const handleRefresh = async () => {
    try {
      let videoData;
      if (jobid && userDetails?.jobid === jobid) {
        const response = await axiosInstance.get(`/videos/job/${jobid}`);
        videoData = response.data || [];
        setFilteredVideos(videoData);
        showSnackbar('Job-specific videos refreshed successfully', 'success');
      } else {
        videoData = await refreshVideos();
        setFilteredVideos(videoData);
        showSnackbar('Videos refreshed successfully', 'success');
      }
    } catch (error) {
      console.error('Error refreshing videos:', error);
      showSnackbar('Failed to refresh videos', 'error');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    
    if (field === 'city' && value !== 'Other') {
      setCustomCity('');
    }
    if (field === 'industry' && value !== 'Other') {
      setCustomIndustry('');
    }
  };

  const handleCustomCityChange = (value) => {
    setCustomCity(value);
    setFilters(prev => ({ ...prev, city: value }));
  };

  const handleCustomIndustryChange = (value) => {
    setCustomIndustry(value);
    setFilters(prev => ({ ...prev, industry: value }));
  };

  const applyFilters = async () => {
    const hasFilters = Object.values(filters).some(val => val.trim() !== '');
    
    if (!hasFilters) {
      setFilteredVideos(videos);
      showSnackbar('No filters applied - showing all videos', 'info');
      return;
    }

    try {
      setFilterLoading(true);
      const filterData = {
        keyWords: filters.keyWords,
        keyskills: filters.keyskills,
        experience: filters.experience,
        industry: filters.industry === 'Other' ? customIndustry : filters.industry,
        city: filters.city === 'Other' ? customCity : filters.city,
        college: filters.college,
        jobid: filters.jobid
      };
      
      console.log(filters);

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
      jobid: jobid || ''
    });
    setCustomCity('');
    setCustomIndustry('');
    setFilteredVideos(videos);
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
      {jobid && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9' }}>
          <Typography variant="h6" color="primary">
            Job-Specific Videos (Job ID: {jobid})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing videos related to your assigned job
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          startIcon={<FilterList />}
          endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          variant="outlined"
        >
          Filters
        </Button>
        
        <Button
          startIcon={<Refresh />}
          variant="outlined"
          onClick={handleRefresh}
          disabled={isLoadingVideos}
        >
          {isLoadingVideos ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

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
                  <MenuItem value="2-3">2-3 years</MenuItem>
                  <MenuItem value="5-10">5-10 years</MenuItem>
                  <MenuItem value="Above 10">Above 10 years</MenuItem>
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
                  {industryOptions.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {filters.industry === 'Other' && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Custom Industry"
                  value={customIndustry}
                  onChange={(e) => handleCustomIndustryChange(e.target.value)}
                  placeholder="Enter industry name"
                />
              </Grid>
            )}
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.city}
                  label="City"
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {filters.city === 'Other' && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Custom City"
                  value={customCity}
                  onChange={(e) => handleCustomCityChange(e.target.value)}
                  placeholder="Enter city name"
                />
              </Grid>
            )}
            
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

      {videoError && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#fee2e2', borderRadius: 2, border: '1px solid #fca5a5' }}>
          <Typography color="error">
            {videoError}
          </Typography>
        </Box>
      )}

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
              : jobid ? 'No videos available for this job' : 'No videos available'
            }
          </Typography>
        </Box>
      )}

      {!isLoadingVideos && filteredVideos.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
            {jobid && ' for this job'}
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
}