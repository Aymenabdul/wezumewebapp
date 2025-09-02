import {
    Box, 
    Container,
    Typography
} from "@mui/material";
import VideoGrid from "../components/videos/VideoGrid";

export default function Videos() {
    return (
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            px: { xs: 2, md: 3 },
            pb: 2
          }}
        >
            <Box
              sx={{
                height: "64px",
                width: "100%",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                mb: 2
              }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Videos
                </Typography>
            </Box>
            <VideoGrid />
        </Container>
    )
}