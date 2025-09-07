/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Drawer, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import VideoGrid from "../components/videos/VideoGrid";
import axiosInstance from "../axios/axios";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({
    keywords: "",
    keySkills: "",
    industry: "",
    city: "",
    college: "",
    jobId: "",
    experience: ""
  });
  const [loading, setLoading] = useState(true); 
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchAllVideos();
  }, []);

  const fetchAllVideos = async () => {
    setLoading(true);
    try {
      console.log('Fetching all videos...'); 
      const response = await axiosInstance.get('/api/videos/videos');
      console.log('Videos response:', response.data);
      setVideos(response.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Only use /api/videos/filter endpoint for all filtering
  const fetchFilteredVideos = async () => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some(value => value !== '');
      
      let response;
      if (hasFilters) {
        const filterData = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );
        
        // FIXED: Always use the filter endpoint, never the job endpoint for general filtering
        response = await axiosInstance.post('/api/videos/filter', filterData);
        console.log('Filtered videos response:', response.data);
      } else {
        response = await axiosInstance.get('/api/videos/videos');
      }
      
      setVideos(response.data || []);
    } catch (error) {
      console.error('Error filtering videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };

  const applyFilters = () => {
    fetchFilteredVideos();
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      keywords: "",
      keySkills: "",
      industry: "",
      city: "",
      college: "",
      jobId: "",
      experience: ""
    });
    setTimeout(() => fetchAllVideos(), 100);
    setFilterOpen(false);
  };

  const handleLikeToggle = async (videoId, userId, firstName, currentlyLiked) => {
    if (actionLoading[videoId]) return;
    
    setActionLoading(prev => ({ ...prev, [videoId]: true }));
    
    try {
      const endpoint = currentlyLiked ? 'dislike' : 'like';
      await axiosInstance.post(`/api/videos/${videoId}/${endpoint}`, null, {
        params: { userId, firstName }
      });
    } catch (error) {
      console.error('Like toggle failed:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [videoId]: false }));
    }
  };

  return (
    <>
      <IconButton
        onClick={toggleFilter}
        sx={{
          position: 'fixed',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          bgcolor: 'primary.main',
          color: 'white',
          zIndex: 1300,
          boxShadow: 3,
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
      >
        <FilterListIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Filter Videos
          </Typography>

          <TextField
            fullWidth
            label="Keywords"
            value={filters.keywords}
            onChange={handleFilterChange('keywords')}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Key Skills"
            value={filters.keySkills}
            onChange={handleFilterChange('keySkills')}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="City"
            value={filters.city}
            onChange={handleFilterChange('city')}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="College"
            value={filters.college}
            onChange={handleFilterChange('college')}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Job ID (e.g., C191)"
            value={filters.jobId}
            onChange={handleFilterChange('jobId')}
            sx={{ mb: 2 }}
            size="small"
            helperText="Note: This will filter through all videos, not use the job-specific endpoint"
          />

          <TextField
            fullWidth
            label="Experience"
            value={filters.experience}
            onChange={handleFilterChange('experience')}
            sx={{ mb: 2 }}
            size="small"
          />

          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Industry</InputLabel>
            <Select
              value={filters.industry}
              onChange={handleFilterChange('industry')}
              label="Industry"
            >
              <MenuItem value="">All Industries</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            onClick={applyFilters}
            disabled={loading}
            sx={{ mb: 1 }}
          >
            {loading ? 'Filtering...' : 'Apply Filters'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={clearFilters}
            disabled={loading}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>

      <Container maxWidth={false} sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Videos
        </Typography>
        
        <VideoGrid 
          videos={videos}
          loading={loading}
          onLikeToggle={handleLikeToggle}
          actionLoading={actionLoading}
        />
      </Container>
    </>
  );
}