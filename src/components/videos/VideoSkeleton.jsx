import { Card, Skeleton, CardContent, Box } from '@mui/material';

const VideoSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

export default VideoSkeleton;