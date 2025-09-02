import { useState } from 'react';
import {
    AppBar,
    Box,
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
    useMediaQuery,
    Menu,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideocamIcon from '@mui/icons-material/Videocam';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useLocation, useNavigate } from 'react-router';

const drawerWidth = 240;

export default function BaseLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMoreClick = (event) => {
        setMoreAnchor(event.currentTarget);
    };

    const handleMoreClose = () => {
        setMoreAnchor(null);
    };

    const handleLogout = () => {
        navigate('/login');
        if (isMobile) handleDrawerToggle();
    };

    const navLinks = [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/app/dashboard" },
        { label: "Videos", icon: <VideocamIcon />, path: "/app/videos" },
        { label: "Trending", icon: <WhatshotIcon />, path: "/app/trending" },
        { label: "Profile", icon: <PersonIcon /> },
    ];

    const moreMenuItems = [
        { label: "Terms and Conditions", icon: <GavelIcon /> },
        { label: "Privacy Policy", icon: <PrivacyTipIcon /> }
    ];

    const isMoreOpen = Boolean(moreAnchor);

    const drawer = (
        <>
            <Toolbar>
                <Box sx={{ display: "flex", alignItems: "center",filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.3))", }}>
                    <img
                        src="/whitelogo.png" 
                        alt="Wezume Logo"
                        style={{
                            height: "45px", 
                            objectFit: "contain",
                        }}
                    />
                </Box>
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
                {navLinks.map((navLink, index) => {
                    const isActive = location.pathname === navLink.path;
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                sx={{
                                    borderRadius: 2,
                                    display: "flex",
                                    gap: 1.5,
                                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                                onClick={() => {
                                    navigate(navLink.path);
                                    if (isMobile) handleDrawerToggle();
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 'auto' }}>
                                    {navLink.icon}
                                </ListItemIcon>
                                <ListItemText primary={navLink.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <List
                sx={{
                    marginTop: 'auto',
                    marginBottom: '3px',
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
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
                        onClick={handleLogout}
                    >
                        <ListItemIcon sx={{
                            color: 'white',
                            minWidth: 'auto',
                        }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
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
                        onClick={(event) => {
                            handleMoreClick(event);
                            if (isMobile) handleDrawerToggle();
                        }}
                    >
                        <ListItemIcon sx={{
                            color: 'white',
                            minWidth: 'auto',
                            transform: isMoreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <MoreVertIcon />
                        </ListItemIcon>
                        <ListItemText primary="More" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Menu
                anchorEl={moreAnchor}
                open={isMoreOpen}
                onClose={handleMoreClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: '#1CA7EC',
                            color: 'white',
                            minWidth: 220,
                            boxShadow: 'none',
                            ml: 2,
                            '& .MuiMenuItem-root': {
                                gap: 1.5,
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }
                        }
                    }
                }}
            >
                {moreMenuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleMoreClose}
                    >
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)", 
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
                            background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)", 
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
                            background: "linear-gradient(135deg, #1CA7EC 0%, #7BD5F5 100%)",
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