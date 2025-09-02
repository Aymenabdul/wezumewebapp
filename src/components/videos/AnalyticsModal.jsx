import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

export default function AnalyticsModal({ open, onClose, data }) {
  const getColorForScore = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getIconForMetric = (name) => {
    switch (name.toLowerCase()) {
      case "confidence":
        return <TrendingUpIcon sx={{ color: "#3b82f6" }} />;
      case "body language":
        return <PsychologyIcon sx={{ color: "#8b5cf6" }} />;
      case "emotion":
        return <SentimentSatisfiedAltIcon sx={{ color: "#f97316" }} />;
      default:
        return <TrendingUpIcon sx={{ color: "#6b7280" }} />;
    }
  };

  const getGradeLabel = (score) => {
    if (score >= 90) return { label: "Excellent", color: "#22c55e" };
    if (score >= 80) return { label: "Good", color: "#65a30d" };
    if (score >= 70) return { label: "Average", color: "#f59e0b" };
    if (score >= 60) return { label: "Below Average", color: "#f97316" };
    return { label: "Poor", color: "#ef4444" };
  };

  const averageScore = data.reduce((acc, item) => acc + item.score, 0) / data.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUpIcon sx={{ color: "#374151" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600" color="#111827">
              Performance Analytics
            </Typography>
            <Typography variant="body2" color="#6b7280">
              Video analysis results
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#6b7280",
            "&:hover": {
              backgroundColor: "#f3f4f6",
              color: "#374151",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Card
          sx={{
            mb: 3,
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="subtitle1" color="#6b7280" gutterBottom>
              Overall Score
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "700",
                  color: getColorForScore(averageScore),
                  fontSize: "3.5rem",
                  lineHeight: 1,
                }}
              >
                {Math.round(averageScore)}
              </Typography>
              <Typography variant="h6" color="#6b7280" sx={{ mt: 0.5 }}>
                out of 100
              </Typography>
            </Box>
            <Chip
              label={getGradeLabel(averageScore).label}
              sx={{
                backgroundColor: getGradeLabel(averageScore).color,
                color: "white",
                fontWeight: "600",
                fontSize: "0.875rem",
                px: 1,
              }}
            />
          </CardContent>
        </Card>

        <Divider sx={{ mb: 3, color: "#e5e7eb" }} />

        <Typography variant="h6" color="#374151" sx={{ mb: 2, fontWeight: "600" }}>
          Detailed Breakdown
        </Typography>

        <Grid container spacing={2}>
          {data.map((item, idx) => (
            <Grid item size={{ xs: 12 }} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  },
                  transition: "box-shadow 0.2s ease-in-out",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      backgroundColor: "#f3f4f6",
                      mr: 2,
                    }}
                  >
                    {getIconForMetric(item.name)}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#374151", flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "700",
                        color: getColorForScore(item.score),
                      }}
                    >
                      {item.score}
                    </Typography>
                    <Chip
                      label={getGradeLabel(item.score).label}
                      size="small"
                      sx={{
                        backgroundColor: getColorForScore(item.score),
                        color: "white",
                        fontWeight: "500",
                        minWidth: "80px",
                      }}
                    />
                  </Box>
                </Box>

                {item.description && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "#f9fafb",
                      borderRadius: 1.5,
                      borderLeft: `4px solid ${getColorForScore(item.score)}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >
          <Typography variant="body2" sx={{ color: "#1e40af", textAlign: "center" }}>
            💡 <strong>Tip:</strong> Focus on improving your lowest scoring metrics for better overall performance
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}