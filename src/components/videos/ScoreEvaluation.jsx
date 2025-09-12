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
  Stack,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { 
  TrendingUp, 
  Star, 
  Psychology, 
  Favorite, 
  Visibility,
  EmojiEvents,
  Assessment,
  Error
} from '@mui/icons-material';

export default function ScoreEvaluation({ scoreData, video, loading = false, error = false }) {
  const decodeProfilePic = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('https://wezume')) return pic;
    try {
      return atob(pic);
    } catch {
      return pic;
    }
  };

  const getFeedback = (Clarity, Confidence, Authenticity, emotional) => {
    const scores = [
      { key: 'Clarity', value: Number(Clarity) },
      { key: 'Confidence', value: Number(Confidence) },
      { key: 'Authenticity', value: Number(Authenticity) },
      { key: 'Emotional', value: Number(emotional) },
    ];
    scores.sort((a, b) => a.value - b.value);
    const weakest = scores[0]?.key;
    if (!weakest) return { strength: 'Well-rounded performance!', improvement: 'Continue practicing all areas.' };
    const feedbackMessages = {
      Clarity: { strength: 'Shows potential to express ideas.', improvement: 'Needs structured thought and clearer articulation.' },
      Confidence: { strength: 'Shows honesty and openness.', improvement: 'Work on tone, eye contact, and vocal steadiness.' },
      Authenticity: { strength: 'Cautious and controlled.', improvement: 'Loosen up for better emotional engagement.' },
      Emotional: { strength: 'Mindful and considered.', improvement: 'Vary pace and tone to match emotional context.' },
    };
    return feedbackMessages[weakest];
  };

  const getHashtags = score => {
    const clarity = score?.Clarity ?? 0;
    if (clarity < 4) {
      const tags = ['#Fragmented', '#Unclear', '#Fuzzy'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (clarity >= 4 && clarity <= 6) {
      const tags = ['#Improving', '#Understandable', '#Coherent'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (clarity > 6 && clarity <= 8) {
      const tags = ['#Fluent', '#Clear', '#Articulate'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    return ['#Articulate'];
  };

  const getHashtags1 = score => {
    const confidence = score?.Confidence ?? 0;
    if (confidence < 4) {
      const tags = ['#Hesitant', '#Unsteady', '#Reserved'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (confidence >= 4 && confidence <= 6) {
      const tags = ['#Composed', '#Balanced', '#Steady'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (confidence > 6 && confidence <= 8) {
      const tags = ['#Poised'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    return ['#Assured'];
  };

  const getHashtags2 = score => {
    const authenticity = score?.Authenticity ?? 0;
    if (authenticity < 4) {
      const tags = ['#Guarded', '#Mechanical', '#Distant'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (authenticity >= 4 && authenticity <= 6) {
      const tags = ['#Honest', '#Sincere', '#Natural'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (authenticity > 6 && authenticity <= 8) {
      const tags = ['#Natural'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    return ['#Genuine'];
  };

  const getHashtags3 = score => {
    const emotional = score?.EmotionalExpressiveness ?? 0;
    if (emotional < 4) {
      const tags = ['#Disconnected', '#Flat', '#Detached'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (emotional >= 4 && emotional <= 6) {
      const tags = ['#In-Tune', '#Observant', '#Thoughtful'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    if (emotional > 6 && emotional <= 8) {
      const tags = ['#Empathic'];
      return [tags[Math.floor(Math.random() * tags.length)]];
    }
    return ['#Expressive'];
  };

  // Enhanced Loading State with Skeletons
  if (loading) {
    return (
      <Box sx={{ 
        height: '100%', 
        overflow: 'auto',
        p: 2
      }}>
        {/* Profile Section Skeleton */}
        <Paper sx={{ 
          mb: 2, 
          p: 2,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={60} height={60} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rounded" width={80} height={24} sx={{ mt: 1 }} />
            </Box>
          </Stack>
        </Paper>

        {/* Overall Score Section Skeleton */}
        <Paper sx={{ 
          mb: 3,
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={60} sx={{ color: '#1976d2' }} />
          </Box>
          <Typography variant="h6" sx={{ 
            color: '#1976d2',
            fontWeight: 600,
            mb: 1
          }}>
            Analyzing Performance
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#6b7280',
            fontWeight: 500
          }}>
            Please wait while we evaluate the video...
          </Typography>
          <Box sx={{ maxWidth: 300, mx: 'auto', mt: 2 }}>
            <Skeleton variant="rounded" height={12} />
          </Box>
        </Paper>

        {/* Breakdown Section Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={100} height={28} />
          </Stack>

          <Grid container spacing={1.5}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper sx={{ 
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                    <Skeleton variant="rounded" width={32} height={32} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="40%" height={20} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                    <Skeleton variant="text" width={30} height={28} />
                  </Stack>
                  <Skeleton variant="rounded" height={6} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Analysis Section Skeleton */}
        <Paper sx={{ 
          p: 2.5,
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={80} height={28} />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" width={80} height={24} />
            ))}
          </Box>

          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={20} />
        </Paper>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box sx={{ 
        height: '100%', 
        overflow: 'auto',
        p: 2
      }}>
        <Paper sx={{ 
          mb: 2, 
          p: 2,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              src={decodeProfilePic(video?.profilepic)} 
              sx={{ 
                width: 60, 
                height: 60,
                border: '2px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
              }}
            >
              {video?.firstname?.charAt(0)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 0.5, 
                color: '#111827',
                fontSize: '1.1rem'
              }}>
                {video?.firstname}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.8, fontSize: '0.85rem' }}>
                {video?.email}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ 
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <Box sx={{ mb: 2 }}>
            <Error sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
            <Typography variant="h6" sx={{ 
              color: '#ef4444',
              fontWeight: 600,
              mb: 1
            }}>
              No total score found for the video
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6b7280',
              fontWeight: 500
            }}>
              Score evaluation is not available for this video
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Success State - when scoreData exists
  if (!scoreData) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#ef4444';
    return '#6b7280';
  };

  const getScoreIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'clarity': return <Visibility fontSize="small" />;
      case 'confidence': return <TrendingUp fontSize="small" />;
      case 'authenticity': return <Star fontSize="small" />;
      case 'emotional': return <Favorite fontSize="small" />;
      default: return <EmojiEvents fontSize="small" />;
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

  const clarityHashtag = getHashtags({ Clarity: scoreData.clarityScore })[0];
  const confidenceHashtag = getHashtags1({ Confidence: scoreData.confidenceScore })[0];
  const authenticityHashtag = getHashtags2({ Authenticity: scoreData.authenticityScore })[0];
  const emotionalHashtag = getHashtags3({ EmotionalExpressiveness: scoreData.emotionalScore })[0];
  
  const feedback = getFeedback(
    scoreData.clarityScore, 
    scoreData.confidenceScore, 
    scoreData.authenticityScore, 
    scoreData.emotionalScore
  );

  return (
    <Box sx={{ 
      height: '100%', 
      overflow: 'auto',
      p: 2
    }}>
      <Paper sx={{ 
        mb: 2, 
        p: 2,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 24,
                height: 24,
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
                  fontSize: '10px', 
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
                width: 60, 
                height: 60,
                border: '2px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
              }}
            >
              {video.firstname?.charAt(0)}
            </Avatar>
          </Badge>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 0.5, 
              color: '#111827',
              fontSize: '1.1rem'
            }}>
              {video.firstname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.8, fontSize: '0.85rem' }}>
              {video.email}
            </Typography>
            <Chip 
              label={totalPerformance.label}
              size="small"
              sx={{ 
                bgcolor: totalPerformance.color,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ 
        mb: 3,
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            color: getScoreColor(scoreData.totalScore),
            mb: 1
          }}>
            {scoreData.totalScore}
            <Typography component="span" variant="h5" sx={{ color: 'text.secondary', opacity: 0.6 }}>
              /10
            </Typography>
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#6b7280',
            fontWeight: 500
          }}>
            Overall Performance Score
          </Typography>
        </Box>
        
        <Box sx={{ maxWidth: 300, mx: 'auto' }}>
          <LinearProgress 
            variant="determinate" 
            value={(scoreData.totalScore / 10) * 100} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(scoreData.totalScore),
                borderRadius: 6
              }
            }}
          />
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Assessment sx={{ color: '#6b7280', fontSize: 20 }} />
          <Typography variant="h6" sx={{ 
            color: '#111827', 
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            Breakdown
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {scores.map((score, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Paper sx={{ 
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: `${getScoreColor(score.value)}15`,
                    color: getScoreColor(score.value),
                    display: 'flex'
                  }}>
                    {getScoreIcon(score.label)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      mb: 0.5
                    }}>
                      {score.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                      {score.description}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ 
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
                    height: 6, 
                    borderRadius: 3,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(score.value),
                      borderRadius: 3
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper sx={{ 
        p: 2.5,
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Psychology sx={{ color: '#6b7280', fontSize: 20 }} />
          <Typography variant="h6" sx={{ 
            color: '#111827', 
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            Analysis
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={clarityHashtag}
            size="small"
            sx={{ 
              bgcolor: getScoreColor(scoreData.clarityScore),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
          <Chip 
            label={confidenceHashtag}
            size="small"
            sx={{ 
              bgcolor: getScoreColor(scoreData.confidenceScore),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
          <Chip 
            label={authenticityHashtag}
            size="small"
            sx={{ 
              bgcolor: getScoreColor(scoreData.authenticityScore),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
          <Chip 
            label={emotionalHashtag}
            size="small"
            sx={{ 
              bgcolor: getScoreColor(scoreData.emotionalScore),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ 
          color: 'text.secondary', 
          mb: 1,
          fontWeight: 500,
          fontSize: '0.85rem'
        }}>
          💪 <strong>Strength:</strong> {feedback.strength}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.85rem'
        }}>
          🎯 <strong>Improvement:</strong> {feedback.improvement}
        </Typography>
      </Paper>
    </Box>
  );
}
