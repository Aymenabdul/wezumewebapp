import { useState } from 'react';
import { 
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet } from 'react-router';

const drawerWidth = 240;

export default function BaseLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg')); 

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navLinks = [
        { label: "Dashboard", icon: <DashboardIcon /> },
        { label: "Videos", icon: <VideocamIcon /> },
        { label: "Openings", icon: <WorkIcon /> }
    ];

    const drawer = (
        <>
            <Toolbar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Wezume
                </Typography>
            </Toolbar>
            <List
                sx={{
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                {navLinks.map((navLink, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton 
                            sx={{ 
                                borderRadius: 2, 
                                display: "flex", 
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 'auto' }}>
                                {navLink.icon}
                            </ListItemIcon>
                            <ListItemText primary={navLink.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List 
                sx={{ 
                    marginTop: 'auto',
                    marginBottom: '3px',
                    px: 2,
                }}
            >
                <ListItem disablePadding>
                    <ListItemButton 
                        sx={{ 
                            borderRadius: 2, 
                            display: "flex", 
                            gap: 1.5,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                        onClick={isMobile ? handleDrawerToggle : undefined}
                    >
                        <ListItemIcon sx={{ color: 'white', minWidth: 'auto' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        bgcolor: "#0087e0",
                        zIndex: theme.zIndex.drawer + 1,
                    }}
                    elevation={0}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Wezume
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {!isMobile && (
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: "#0087e0",
                            color: "white",
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    {drawer}
                </Drawer>
            )}

            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, 
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: "#0087e0",
                            color: "white",
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    marginTop: isMobile ? '50px' : 0, 
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}