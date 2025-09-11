import { Box, Typography, Paper, Avatar, Divider } from '@mui/material';

const CommentsSection = ({ videoId }) => {
  const mockComments = [
    { id: 1, user: 'John Doe', comment: 'Great video! Very informative.', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', comment: 'Excellent presentation skills.', time: '5 hours ago' },
    { id: 3, user: 'Mike Johnson', comment: 'Really impressed with the content.', time: '1 day ago' }
  ];

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" mb={3}>Comments</Typography>
      {mockComments.map((comment, index) => (
        <Box key={comment.id}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {comment.user.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">{comment.user}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {comment.time}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {comment.comment}
              </Typography>
            </Box>
          </Box>
          {index < mockComments.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Paper>
  );
};

export default CommentsSection;