import { Card, Skeleton } from '@mui/material';

const VideoSkeleton = () => (
  <Card sx={{ 
    aspectRatio: '1 / 1',
    borderRadius: 4,
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