// components/videos/ScoreEvaluation.jsx
import React from 'react';
import { Box, Typography, LinearProgress, Paper, Avatar } from '@mui/material';

const ScoreEvaluation = ({ scoreData, video }) => {
  const decodeProfilePic = (pic) => {
    if (pic && pic.startsWith('https://wezume')) return pic;
    try {
      return atob(pic);
    } catch {
      return pic;
    }
  };

  if (!scoreData) return <Box>Loading scores...</Box>;

  const scores = [
    { label: 'Total Score', value: scoreData.totalScore },
    { label: 'Clarity', value: scoreData.clarityScore },
    { label: 'Confidence', value: scoreData.confidenceScore },
    { label: 'Authenticity', value: scoreData.authenticityScore },
    { label: 'Emotional', value: scoreData.emotionalScore }
  ];

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar 
          src={decodeProfilePic(video.profilepic)} 
          sx={{ width: 60, height: 60, mr: 2 }}
        >
          {video.firstname?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">{video.firstname}</Typography>
          <Typography variant="body2" color="text.secondary">{video.email}</Typography>
        </Box>
      </Box>
      
      <Typography variant="h6" mb={3}>Score Evaluation</Typography>
      {scores.map((score, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{score.label}</Typography>
            <Typography variant="body2">{score.value}/10</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(score.value / 10) * 100} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      ))}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Tags Section</Typography>
        <Typography variant="body2" color="text.secondary">
          Tags will be added here later
        </Typography>
      </Box>
    </Paper>
  );
};

export default ScoreEvaluation;