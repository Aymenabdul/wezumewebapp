import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  Paper,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

export default function AnalyticsModal({ open, onClose, data }) {
  const getColorForScore = (score) => {
    if (score >= 80) return "#4caf50"; // Green
    if (score >= 60) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };

  const getIconForMetric = (name) => {
    switch (name.toLowerCase()) {
      case "confidence":
        return <TrendingUpIcon sx={{ color: "#2196f3" }} />;
      case "body language":
        return <PsychologyIcon sx={{ color: "#9c27b0" }} />;
      case "emotion":
        return <SentimentSatisfiedAltIcon sx={{ color: "#ff5722" }} />;
      default:
        return <TrendingUpIcon sx={{ color: "#607d8b" }} />;
    }
  };

  const getGradeLabel = (score) => {
    if (score >= 90) return { label: "Excellent", color: "#4caf50" };
    if (score >= 80) return { label: "Good", color: "#8bc34a" };
    if (score >= 70) return { label: "Average", color: "#ff9800" };
    if (score >= 60) return { label: "Below Average", color: "#ff5722" };
    return { label: "Poor", color: "#f44336" };
  };

  const averageScore = data.reduce((acc, item) => acc + item.score, 0) / data.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <TrendingUpIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Video Analytics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Performance insights and metrics
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Overall Score Card */}
        <Card
          sx={{
            mb: 3,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CardContent sx={{ textAlign: "center", color: "white" }}>
            <Typography variant="h6" gutterBottom>
              Overall Performance
            </Typography>
            <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `conic-gradient(${getColorForScore(averageScore)} ${
                    averageScore * 3.6
                  }deg, rgba(255,255,255,0.1) 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {Math.round(averageScore)}
                  </Typography>
                  <Typography variant="caption">Score</Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={getGradeLabel(averageScore).label}
              sx={{
                backgroundColor: getGradeLabel(averageScore).color,
                color: "white",
                fontWeight: "bold",
              }}
            />
          </CardContent>
        </Card>

        {/* Individual Metrics */}
        <Grid container spacing={2}>
          {data.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getIconForMetric(item.name)}
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ ml: "auto" }}>
                    <Chip
                      label={`${item.score}%`}
                      sx={{
                        backgroundColor: getColorForScore(item.score),
                        color: "white",
                        fontWeight: "bold",
                        minWidth: "60px",
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={item.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getColorForScore(item.score),
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {item.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontStyle: "italic",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      p: 1.5,
                      borderRadius: 1,
                      borderLeft: `3px solid ${getColorForScore(item.score)}`,
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Summary */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: "center" }}>
            💡 <strong>Tip:</strong> Focus on improving your lowest scoring metrics for better overall performance
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}