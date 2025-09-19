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
import axiosInstance from '../axios/axios';
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

const filterVideosWithThumbnails = (videos) => {
  return videos.filter(video => {
    const thumbnail = video.thumbnail || video.thumbnailUrl || video.thumb;
    return thumbnail && thumbnail.trim() !== '';
  });
};

export default function Videos() {
  const [searchParams] = useSearchParams();
  const jobid = searchParams.get('jobid');
  const scrollContainerRef = useRef(null);

  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
    refreshVideos
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

  const removeDuplicateVideos = (videoArray) => {
    return videoArray.filter((video, index, self) => {
      const uniqueId = video.id || video.videoId || video.videoID;
      if (!uniqueId) return true;
      
      return index === self.findIndex(v => {
        const compareId = v.id || v.videoId || v.videoID;
        return compareId === uniqueId;
      });
    });
  };

  const loadMoreFilteredVideos = useCallback(async () => {
    if (currentPage >= totalPages - 1 || filterLoading) return;

    try {
      setFilterLoading(true);
      const nextPage = currentPage + 1;

      const finalFilterValues = {
        transcriptionKeywords: filters.transcriptionKeywords,
        keyskills: filters.keyskills,
        experience: filters.experience,
        industry: filters.industry,
        city: filters.city,
        college: filters.college,
        jobId: filters.jobid 
      };
      
      const payload = {};
      for (const [key, value] of Object.entries(finalFilterValues)) {
        if (value && value.toString().trim() !== '') {
          payload[key] = value;
        }
      }

      const response = await axiosInstance.post(`/videos/filter?page=${nextPage}&size=20`, payload);

      if (response.data && response.data.videos && response.data.videos.length > 0) {
        const newVideos = response.data.videos;
        const combinedVideos = [...filteredVideos, ...newVideos];
        const uniqueCombinedVideos = removeDuplicateVideos(combinedVideos);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueCombinedVideos);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        setCurrentPage(nextPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading more filtered videos:', error);
      showSnackbar('Failed to load more videos', 'error');
    } finally {
      setFilterLoading(false);
    }
  }, [currentPage, totalPages, filterLoading, filters, filteredVideos]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage > 0.8) {
      if (isFilteredResults && currentPage < totalPages - 1 && !filterLoading) {
        loadMoreFilteredVideos();
      } else if (!isFilteredResults && hasMoreVideos && !isLoadingMoreVideos && !filterLoading) {
        const hasFilters = Object.values(filters).some(val => val && val.toString().trim() !== '');
        if (!hasFilters) {
          loadMoreVideos();
        }
      }
    }
  }, [hasMoreVideos, isLoadingMoreVideos, filterLoading, filters, loadMoreVideos, isFilteredResults, currentPage, totalPages, loadMoreFilteredVideos]);

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
    if (!isLoadingVideos && videos.length > 0 && !isFilteredResults) {
      const uniqueVideos = removeDuplicateVideos(videos);
      const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideos);
      setFilteredVideos(videosWithThumbnails);
      storeFilteredVideosForNavigation(videosWithThumbnails);
    }
  }, [videos, isLoadingVideos, isFilteredResults]);

  const applyPersistedFilters = async () => {
    const persistedFilters = getPersistedFilters();
    if (!persistedFilters) {
      fetchVideos();
      return;
    }

    const finalFilterValues = {
      transcriptionKeywords: persistedFilters.transcriptionKeywords,
      keyskills: persistedFilters.keyskills,
      experience: persistedFilters.experience,
      industry: persistedFilters.industry,
      city: persistedFilters.city,
      college: persistedFilters.college,
      jobId: persistedFilters.jobid
    };

    const hasFilters = Object.values(finalFilterValues).some(val => val && val.toString().trim() !== '');

    if (!hasFilters) {
      fetchVideos();
      return;
    }

    try {
      setFilterLoading(true);
      setCurrentPage(0);

      const payload = {};
      for (const [key, value] of Object.entries(finalFilterValues)) {
        if (value && value.toString().trim() !== '') {
          payload[key] = value;
        }
      }

      const response = await axiosInstance.post(`/videos/filter?page=0&size=20`, payload);

      if (response.data && response.data.videos && response.data.videos.length > 0) {
        const uniqueFilteredVideos = removeDuplicateVideos(response.data.videos);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueFilteredVideos);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        setCurrentPage(response.data.currentPage || 0);
        setTotalPages(response.data.totalPages || 1);
        setIsFilteredResults(true);
      } else {
        setFilteredVideos([]);
        storeFilteredVideosForNavigation([]);
        setCurrentPage(0);
        setTotalPages(0);
        setIsFilteredResults(true);
      }
    } catch (error) {
      console.error('Error applying persisted filters:', error);
      fetchVideos();
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      let videoData;
      if (jobid && userDetails?.jobid === jobid) {
        const response = await axiosInstance.get(`/videos/job/${jobid}`, {
          params: { page: 0, size: 20 }
        });
        videoData = response.data?.videos || [];
        const uniqueVideoData = removeDuplicateVideos(videoData);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideoData);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        setIsFilteredResults(false);
      } else {
        videoData = await getVideos();
        const uniqueVideoData = removeDuplicateVideos(videoData);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideoData);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        setIsFilteredResults(false);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      showSnackbar('Failed to fetch videos', 'error');
    }
  };

  const handleRefresh = async () => {
    try {
      setCurrentPage(0);
      setIsFilteredResults(false);
      let videoData;
      if (jobid && userDetails?.jobid === jobid) {
        const response = await axiosInstance.get(`/videos/job/${jobid}`, {
          params: { page: 0, size: 20 }
        });
        videoData = response.data?.videos || [];
        const uniqueVideoData = removeDuplicateVideos(videoData);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideoData);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        showSnackbar('Videos refreshed successfully', 'success');
      } else {
        videoData = await refreshVideos();
        const uniqueVideoData = removeDuplicateVideos(videoData);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideoData);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
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
    const finalFilterValues = {
      transcriptionKeywords: filters.transcriptionKeywords,
      keyskills: filters.keyskills,
      experience: filters.experience,
      industry: filters.industry,
      city: filters.city,
      college: filters.college,
      jobId: filters.jobid 
    };

    const hasFilters = Object.values(finalFilterValues).some(val => val && val.toString().trim() !== '');

    if (!hasFilters) {
      const uniqueVideos = removeDuplicateVideos(videos);
      const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideos);
      setFilteredVideos(videosWithThumbnails);
      storeFilteredVideosForNavigation(videosWithThumbnails);
      setIsFilteredResults(false);
      setCurrentPage(0);
      setTotalPages(0);
      persistFilters(filters);
      return;
    }

    try {
      setFilterLoading(true);
      setCurrentPage(0);

      const payload = {};
      for (const [key, value] of Object.entries(finalFilterValues)) {
        if (value && value.toString().trim() !== '') {
          payload[key] = value;
        }
      }

      const response = await axiosInstance.post(`/videos/filter?page=0&size=20`, payload);

      if (response.data && response.data.videos && response.data.videos.length > 0) {
        const uniqueFilteredVideos = removeDuplicateVideos(response.data.videos);
        const videosWithThumbnails = filterVideosWithThumbnails(uniqueFilteredVideos);
        setFilteredVideos(videosWithThumbnails);
        storeFilteredVideosForNavigation(videosWithThumbnails);
        setCurrentPage(response.data.currentPage || 0);
        setTotalPages(response.data.totalPages || 1);
        setIsFilteredResults(true);
        showSnackbar('Fetched videos matching the filters', 'success');
      } else {
        setFilteredVideos([]);
        storeFilteredVideosForNavigation([]);
        setCurrentPage(0);
        setTotalPages(0);
        setIsFilteredResults(true);
        showSnackbar('Fetched videos matching the filters', 'success');
      }
    } catch (error) {
      showSnackbar(`Filter error: ${error.response?.data?.message || error.message}`, 'error');
      const uniqueVideos = removeDuplicateVideos(videos);
      const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideos);
      setFilteredVideos(videosWithThumbnails);
      storeFilteredVideosForNavigation(videosWithThumbnails);
      setIsFilteredResults(false);
    } finally {
      setFilterLoading(false);
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
    const uniqueVideos = removeDuplicateVideos(videos);
    const videosWithThumbnails = filterVideosWithThumbnails(uniqueVideos);
    setFilteredVideos(videosWithThumbnails);
    storeFilteredVideosForNavigation(videosWithThumbnails);
    setCurrentPage(0);
    setTotalPages(0);
    setIsFilteredResults(false);
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
        
        {(isLoadingMoreVideos || filterLoading) && (
          Array(8).fill().map((_, index) => (
            <Grid size={{ xs: 4, lg: 3 }} key={`loading-${index}`}>
              <VideoSkeleton />
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

      {(isLoadingMoreVideos || filterLoading) && filteredVideos.length > 0 && (
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