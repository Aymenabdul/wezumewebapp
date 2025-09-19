import { useState, useEffect, useRef, useCallback } from 'react';
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
  Alert,
  CircularProgress
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess, Refresh } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import VideoCard from '../components/videos/VideoCard';
import VideoSkeleton from '../components/videos/VideoSkeleton';

const getPersistedFilters = () => {
  try {
    const stored = sessionStorage.getItem('videoFilters');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistFilters = (filters) => {
  try {
    sessionStorage.setItem('videoFilters', JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to persist filters:', error);
  }
};

const storeFilteredVideosForNavigation = (videos) => {
  try {
    sessionStorage.setItem('currentVideosList', JSON.stringify(videos));
  } catch (error) {
    console.error('Failed to store filtered videos:', error);
  }
};

export default function Videos() {
  const [searchParams] = useSearchParams();
  const jobid = searchParams.get('jobid');
  const scrollContainerRef = useRef(null);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isFilteredResults, setIsFilteredResults] = useState(false);

  const getInitialFilters = () => {
    const persistedFilters = getPersistedFilters();
    if (persistedFilters) {
      return {
        ...persistedFilters,
        jobid: jobid || persistedFilters.jobid || ''
      };
    }
    return {
      transcriptionKeywords: '',
      keyskills: '',
      experience: '',
      industry: '',
      city: '',
      college: '',
      jobid: jobid || ''
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);

  const {
    userDetails,
    videos,
    isLoadingVideos,
    isLoadingMoreVideos,
    hasMoreVideos,
    videoError,
    getVideos,
    loadMoreVideos,
    refreshVideos,
    filteredVideos,
    isLoadingFilteredVideos,
    isLoadingMoreFilteredVideos,
    hasMoreFilteredVideos,
    filteredVideoError,
    getFilteredVideos,
    loadMoreFilteredVideos,
    refreshFilteredVideos,
  } = useAppStore();

  const cityOptions = [
    'New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'
  ];

  const industryOptions = [
    'Banking & Finance', 'Biotechnology', 'Construction', 'Consumer Goods', 'Education', 'Energy',
    'Healthcare', 'Media & Entertainment', 'Hospitality', 'Information Technology (IT)', 'Insurance',
    'Manufacturing', 'Non-Profit', 'Real Estate', 'Retail', 'Transportation', 'Travel & Tourism',
    'Textiles', 'Logistics & Supply Chain', 'Sports', 'E-commerce', 'Consulting', 'Advertising & Marketing',
    'Architecture', 'Arts & Design', 'Environmental Services', 'Human Resources', 'Legal', 'Management',
    'Telecommunications'
  ];

  const displayVideos = isFilteredResults ? filteredVideos : videos;
  const isLoading = isFilteredResults ? isLoadingFilteredVideos : isLoadingVideos;
  const isLoadingMore = isFilteredResults ? isLoadingMoreFilteredVideos : isLoadingMoreVideos;
  const hasMore = isFilteredResults ? hasMoreFilteredVideos : hasMoreVideos;
  const error = isFilteredResults ? filteredVideoError : videoError;

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage > 0.8) {
      if (isFilteredResults && hasMore && !isLoadingMore) {
        loadMoreFilteredVideos(filters);
      } else if (!isFilteredResults && hasMore && !isLoadingMore) {
        loadMoreVideos();
      }
    }
  }, [hasMore, isLoadingMore, filters, loadMoreVideos, isFilteredResults, loadMoreFilteredVideos]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (jobid) {
      setFilters(prev => {
        const updated = { ...prev, jobid };
        persistFilters(updated);
        return updated;
      });
    }
  }, [jobid]);

  useEffect(() => {
    if (userDetails) {
      const persistedFilters = getPersistedFilters();
      if (persistedFilters && Object.values(persistedFilters).some(val => val && val.toString().trim() !== '')) {
        applyPersistedFilters();
      } else {
        fetchVideos();
      }
    }
  }, [userDetails, jobid]);

  useEffect(() => {
    if (displayVideos.length > 0) {
      storeFilteredVideosForNavigation(displayVideos);
    }
  }, [displayVideos]);

  const applyPersistedFilters = async () => {
    const persistedFilters = getPersistedFilters();
    if (!persistedFilters) {
      fetchVideos();
      return;
    }

    const hasFilters = Object.values(persistedFilters).some(val => val && val.toString().trim() !== '');

    if (!hasFilters) {
      fetchVideos();
      return;
    }

    try {
      setIsFilteredResults(true);
      await getFilteredVideos(persistedFilters);
    } catch (error) {
      console.error('Error applying persisted filters:', error);
      fetchVideos();
    }
  };

  const fetchVideos = async () => {
    try {
      setIsFilteredResults(false);
      await getVideos();
    } catch (error) {
      console.error('Error fetching videos:', error);
      showSnackbar('Failed to fetch videos', 'error');
    }
  };

  const handleRefresh = async () => {
    try {
      if (isFilteredResults) {
        await refreshFilteredVideos(filters);
        showSnackbar('Filtered videos refreshed successfully', 'success');
      } else {
        await refreshVideos();
        showSnackbar('Videos refreshed successfully', 'success');
      }
    } catch (error) {
      console.error('Error refreshing videos:', error);
      showSnackbar('Failed to refresh videos', 'error');
    }
  };

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    persistFilters(updatedFilters);
  };

  const applyFilters = async () => {
    const hasFilters = Object.values(filters).some(val => val && val.toString().trim() !== '');

    if (!hasFilters) {
      setIsFilteredResults(false);
      await getVideos();
      persistFilters(filters);
      return;
    }

    try {
      setIsFilteredResults(true);
      await getFilteredVideos(filters);
      showSnackbar('Fetched videos matching the filters', 'success');
    } catch (error) {
      showSnackbar(`Filter error: ${error.response?.data?.message || error.message}`, 'error');
      setIsFilteredResults(false);
      await getVideos();
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      transcriptionKeywords: '',
      keyskills: '',
      experience: '',
      industry: '',
      city: '',
      college: '',
      jobid: jobid || ''
    };
    setFilters(clearedFilters);
    persistFilters(clearedFilters);
    setIsFilteredResults(false);
    getVideos();
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box 
      ref={scrollContainerRef}
      sx={{ 
        p: 3, 
        height: '100vh', 
        overflow: 'auto'
      }}
    >
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
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
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
                value={filters.transcriptionKeywords}
                onChange={(e) => handleFilterChange('transcriptionKeywords', e.target.value)}
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
              disabled={isLoading}
            >
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </Button>
            <Button variant="outlined" onClick={clearFilters}>
              Clear All
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#fee2e2', borderRadius: 2, border: '1px solid #fca5a5' }}>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      )}

      <Grid container spacing={0.7}>
        {isLoading ? (
          Array(12).fill().map((_, index) => (
            <Grid size={{ xs: 4, lg: 3 }} key={index}>
              <VideoSkeleton />
            </Grid>
          ))
        ) : (
          displayVideos.map((video) => (
            <Grid size={{ xs: 4, lg: 3 }} key={video.id}>
              <VideoCard video={video} />
            </Grid>
          ))
        )}
        
        {isLoadingMore && (
          Array(8).fill().map((_, index) => (
            <Grid size={{ xs: 4, lg: 3 }} key={`loading-${index}`}>
              <VideoSkeleton />
            </Grid>
          ))
        )}
      </Grid>

      {!isLoading && displayVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {Object.values(filters).some(val => val.trim() !== '')
              ? 'No videos found matching your filters'
              : jobid ? 'No videos available for this job' : 'No videos available'
            }
          </Typography>
        </Box>
      )}

      {isLoadingMore && displayVideos.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
            Loading more videos...
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