import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  Avatar, 
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Badge,
  Stack
} from '@mui/material';
import { 
  TrendingUp, 
  Star, 
  Psychology, 
  Favorite, 
  Visibility,
  EmojiEvents,
  Assessment
} from '@mui/icons-material';

export default function ScoreEvaluation({ scoreData, video }) {
  const decodeProfilePic = (pic) => {
    if (pic && pic.startsWith('https://wezume')) return pic;
    try {
      return atob(pic);
    } catch {
      return pic;
    }
  };

  if (!scoreData) {
    return (
      <Box sx={{ 
        p: 4, 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f8fafc'
      }}>
        <Typography variant="h6" color="text.secondary">
          Loading evaluation...
        </Typography>
      </Box>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#ef4444';
    return '#6b7280';
  };

  const getScoreIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'clarity': return <Visibility />;
      case 'confidence': return <TrendingUp />;
      case 'authenticity': return <Star />;
      case 'emotional': return <Favorite />;
      default: return <EmojiEvents />;
    }
  };

  const getPerformanceLabel = (score) => {
    if (score >= 9) return { label: 'Outstanding', color: '#059669' };
    if (score >= 7) return { label: 'Excellent', color: '#0891b2' };
    if (score >= 5) return { label: 'Good', color: '#d97706' };
    if (score >= 3) return { label: 'Average', color: '#dc2626' };
    return { label: 'Needs Work', color: '#7c2d12' };
  };

  const scores = [
    { label: 'Clarity', value: scoreData.clarityScore, description: 'Communication clarity' },
    { label: 'Confidence', value: scoreData.confidenceScore, description: 'Presentation confidence' },
    { label: 'Authenticity', value: scoreData.authenticityScore, description: 'Genuine expression' },
    { label: 'Emotional', value: scoreData.emotionalScore, description: 'Emotional connection' }
  ];

  const totalPerformance = getPerformanceLabel(scoreData.totalScore);

  return (
    <Box sx={{ 
      height: '100%', 
      overflow: 'auto',
      bgcolor: '#f8fafc',
      p: 3
    }}>
      <Paper sx={{ 
        mb: 3, 
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: getScoreColor(scoreData.totalScore),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <Typography variant="caption" sx={{ 
                  color: 'white', 
                  fontSize: '12px', 
                  fontWeight: 700 
                }}>
                  {scoreData.totalScore}
                </Typography>
              </Box>
            }
          >
            <Avatar 
              src={decodeProfilePic(video.profilepic)} 
              sx={{ 
                width: 80, 
                height: 80,
                border: '3px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            >
              {video.firstname?.charAt(0)}
            </Avatar>
          </Badge>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: 1, 
              color: '#111827'
            }}>
              {video.firstname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {video.email}
            </Typography>
            <Chip 
              label={totalPerformance.label}
              sx={{ 
                bgcolor: totalPerformance.color,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 32
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ 
        mb: 4,
        p: 4,
        borderRadius: 3,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 700, 
            color: getScoreColor(scoreData.totalScore),
            mb: 1
          }}>
            {scoreData.totalScore}
            <Typography component="span" variant="h4" color="text.secondary">
              /10
            </Typography>
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#6b7280',
            fontWeight: 500
          }}>
            Overall Performance Score
          </Typography>
        </Box>
        
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <LinearProgress 
            variant="determinate" 
            value={(scoreData.totalScore / 10) * 100} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              bgcolor: '#f3f4f6',
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(scoreData.totalScore),
                borderRadius: 6
              }
            }}
          />
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Assessment sx={{ color: '#6b7280' }} />
          <Typography variant="h6" sx={{ 
            color: '#111827', 
            fontWeight: 600
          }}>
            Detailed Breakdown
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {scores.map((score, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: '#f3f4f6',
                    color: getScoreColor(score.value),
                    display: 'flex'
                  }}>
                    {getScoreIcon(score.label)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      mb: 0.5
                    }}>
                      {score.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {score.description}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ 
                    color: getScoreColor(score.value),
                    fontWeight: 700
                  }}>
                    {score.value}
                  </Typography>
                </Stack>
                
                <LinearProgress 
                  variant="determinate" 
                  value={(score.value / 10) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#f3f4f6',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(score.value),
                      borderRadius: 4
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Psychology sx={{ color: '#6b7280' }} />
          <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600 }}>
            Performance Summary
          </Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {scores.map((score, index) => (
            <Chip 
              key={index}
              label={`${score.label}: ${getPerformanceLabel(score.value).label}`}
              sx={{ 
                bgcolor: getPerformanceLabel(score.value).color,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 32,
                '&:hover': {
                  bgcolor: getPerformanceLabel(score.value).color,
                  opacity: 0.9
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}