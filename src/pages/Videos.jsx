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
            py: 2
          }}
        >
            <VideoGrid />
        </Container>
    )
}