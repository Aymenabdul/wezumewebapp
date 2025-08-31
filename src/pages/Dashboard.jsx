import {
    Container,
    Typography
} from "@mui/material";


export default function Dashboard() {
    return (
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            p: { xs: 0, lg: 2 }
          }}
        >
            <Typography>Dashboard</Typography>
        </Container>
    );
};