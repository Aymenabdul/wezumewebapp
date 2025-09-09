import { Card, Skeleton } from '@mui/material';

const VideoSkeleton = () => (
  <Card sx={{ 
    height: { xs: 200, md: 500 }, 
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%'
  }}>
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height="100%" 
      sx={{ borderRadius: 0 }} 
    />
  </Card>
);

export default VideoSkeleton;