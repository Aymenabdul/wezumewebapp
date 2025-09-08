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
  IconButton
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import axiosInstance from '../axios/axios';
import { useAppStore } from '../store/appStore';
import VideoCard from '../components/videos/VideoCard';
import VideoSkeleton from '../components/videos/VideoSkeleton';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyWords: '',
    keyskills: '',
    experience: '',
    industry: '',
    city: '',
    college: '',
    jobID: ''
  });
  const { userDetails } = useAppStore();

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [videos, filters]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const endpoint = userDetails.jobOption === 'placementDrive' || userDetails.jobOption === 'Academy' 
        ? `/api/videos/job/${userDetails.jobId}`
        : '/api/videos/videos';
      
      const response = await axiosInstance.get(endpoint);
      setVideos(response.data);
      setFilteredVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = async () => {
    if (Object.values(filters).every(val => !val)) {
      setFilteredVideos(videos);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/videos/filter', filters);
      console.log(filters);
      setFilteredVideos(response.data);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredVideos(videos);
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
      jobID: ''
    });
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
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Filter Videos</Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Keywords"
                  value={filters.keyWords}
                  onChange={(e) => handleFilterChange('keyWords', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Key Skills"
                  value={filters.keyskills}
                  onChange={(e) => handleFilterChange('keyskills', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
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

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={filters.industry}
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

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={filters.city}
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

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="College"
                  value={filters.college}
                  onChange={(e) => handleFilterChange('college', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Job ID"
                  value={filters.jobID}
                  onChange={(e) => handleFilterChange('jobID', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Clear All
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      <Grid container spacing={2}>
        {loading ? (
          Array(12).fill().map((_, index) => (
            <Grid key={index} size={{ xs: 4, md: 3 }}>
              <VideoSkeleton />
            </Grid>
          ))
        ) : (
          filteredVideos.map((video) => (
            <Grid key={video.id} size={{ xs: 4, md: 3 }}>
              <VideoCard video={video} />
            </Grid>
          ))
        )}
      </Grid>

      {!loading && filteredVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No videos found matching your filters
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Videos;