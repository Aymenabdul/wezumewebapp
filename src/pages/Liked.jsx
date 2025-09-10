import { useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Button } from '@mui/material';
import { Favorite, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import VideoCard from '../components/videos/VideoCard';
import VideoSkeleton from '../components/videos/VideoSkeleton';

export default function Liked() {
  const navigate = useNavigate();
  const {
    likedVideos,
    isLoadingLikedVideos,
    likedVideoError,
    getLikedVideos,
    refreshLikedVideos
  } = useAppStore();

  useEffect(() => {
    getLikedVideos().catch((error) => {
      console.error('Failed to load liked videos:', error);
    });
  }, [getLikedVideos]);

  const handleRefresh = async () => {
    try {
      await refreshLikedVideos();
    } catch (error) {
      console.error('Failed to refresh liked videos:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          startIcon={<Refresh />}
          variant="outlined"
          onClick={handleRefresh}
          disabled={isLoadingLikedVideos}
        >
          {isLoadingLikedVideos ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {likedVideoError && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#fee2e2', borderRadius: 2, border: '1px solid #fca5a5' }}>
          <Typography color="error">
            {likedVideoError}
          </Typography>
        </Box>
      )}

      <Grid container spacing={0.7}>
        {isLoadingLikedVideos ? (
          Array(8).fill().map((_, index) => (
            <Grid size={{ xs: 4, lg: 3 }} key={index}>
              <VideoSkeleton />
            </Grid>
          ))
        ) : likedVideos.length > 0 ? (
          likedVideos.map((video) => (
            <Grid size={{ xs: 4, lg: 3 }} key={video.id}>
              <VideoCard video={video} />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              bgcolor: '#f8fafc',
              borderRadius: 3,
              border: '1px solid #e5e7eb'
            }}>
              <Favorite sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No liked videos yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start exploring and like videos to see them here
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/app/videos')}
                sx={{ px: 4 }}
              >
                Browse Videos
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {!isLoadingLikedVideos && likedVideos.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {likedVideos.length} liked video{likedVideos.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
}