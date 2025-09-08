import { useState, useEffect } from 'react';
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
    MenuItem,
    Tooltip
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAppStore } from '../store/appStore';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

export default function BaseLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAppStore((state) => state.logout);

    useEffect(() => {
        if (location.pathname === '/app/videos') {
            setIsCollapsed(true);
        } 
    }, [location.pathname]);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

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
        logout();
        if (isMobile) handleDrawerToggle();
    };

    const navLinks = [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/app/dashboard" },
        { label: "Videos", icon: <VideocamIcon />, path: "/app/videos" },
        { label: "Trending", icon: <WhatshotIcon />, path: "/app/trending" },
        { label: "Profile", icon: <PersonIcon />, path: "/app/profile" },
    ];

    const moreMenuItems = [
        { label: "Terms and Conditions", icon: <GavelIcon /> },
        { label: "Privacy Policy", icon: <PrivacyTipIcon /> }
    ];

    const isMoreOpen = Boolean(moreAnchor);
    const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;
    const shouldShowText = isMobile || !isCollapsed;

    const drawer = (
        <>
            <Toolbar sx={{ justifyContent: isCollapsed ? 'center' : 'space-between', position: 'relative' }}>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.3))",
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    width: isCollapsed ? '100%' : 'auto'
                }}>
                    {isCollapsed && !isMobile ? (
                        <img
                            src="/logo-favicon.png"
                            alt="Wezume Logo Collapsed"
                            style={{
                                height: "35px", 
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <img
                            src="/whitelogo.png" 
                            alt="Wezume Logo"
                            style={{
                                height: "45px", 
                                objectFit: "contain",
                            }}
                        />
                    )}
                </Box>
            </Toolbar>
            
            <List
                sx={{
                    px: (isCollapsed && !isMobile) ? 1 : 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    fontFamily: 'Roboto, sans-serif',
                    mt: 1
                }}
            >
                {navLinks.map((navLink, index) => {
                    const isActive = location.pathname === navLink.path;
                    const NavButton = (
                        <ListItemButton
                            sx={{
                                borderRadius: 2,
                                display: "flex",
                                gap: 1.5,
                                justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                                minHeight: 48,
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
                            <ListItemIcon sx={{ 
                                color: 'white', 
                                minWidth: 'auto',
                                justifyContent: 'center'
                            }}>
                                {navLink.icon}
                            </ListItemIcon>
                            {shouldShowText && (
                                <ListItemText 
                                    primary={navLink.label}
                                    sx={{ 
                                        opacity: 1,
                                        transition: 'opacity 0.2s ease'
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );

                    return (
                        <ListItem key={index} disablePadding>
                            {(isCollapsed && !isMobile) ? (
                                <Tooltip title={navLink.label} placement="right" arrow>
                                    {NavButton}
                                </Tooltip>
                            ) : (
                                NavButton
                            )}
                        </ListItem>
                    );
                })}
            </List>
            
            <List
                sx={{
                    marginTop: 'auto',
                    marginBottom: '3px',
                    px: (isCollapsed && !isMobile) ? 1 : 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                }}
            >
                <ListItem disablePadding>
                    {(isCollapsed && !isMobile) ? (
                        <Tooltip title="Logout" placement="right" arrow>
                            <ListItemButton
                                sx={{
                                    borderRadius: 2,
                                    display: "flex",
                                    gap: 1.5,
                                    justifyContent: 'center',
                                    minHeight: 48,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                                onClick={handleLogout}
                            >
                                <ListItemIcon sx={{
                                    color: 'white',
                                    minWidth: 'auto',
                                    justifyContent: 'center'
                                }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    ) : (
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
                            {shouldShowText && <ListItemText primary="Logout" sx={{ transition: 'opacity 0.2s ease' }} />}
                        </ListItemButton>
                    )}
                </ListItem>
                
                <ListItem disablePadding>
                    {(isCollapsed && !isMobile) ? (
                        <Tooltip title="More" placement="right" arrow>
                            <ListItemButton
                                sx={{
                                    borderRadius: 2,
                                    display: "flex",
                                    gap: 1.5,
                                    justifyContent: 'center',
                                    minHeight: 48,
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
                                    justifyContent: 'center',
                                    transform: isMoreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <MoreVertIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    ) : (
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
                            {shouldShowText && <ListItemText primary="More" sx={{ transition: 'opacity 0.2s ease' }} />}
                        </ListItemButton>
                    )}
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
                            ml: (isCollapsed && !isMobile) ? 1 : 2,
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
        <Box sx={{ display: "flex", minHeight: "100vh", position: 'relative' }}>
            {!isMobile && (
                <IconButton
                    onClick={handleToggleCollapse}
                    sx={{
                        position: 'fixed',
                        left: currentDrawerWidth - 15,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: theme.zIndex.drawer + 1,
                        backgroundColor: '#1CA7EC',
                        color: 'white',
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transition: 'left 0.3s ease, background-color 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#1590D3',
                        }
                    }}
                >
                    {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                </IconButton>
            )}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);", 
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
                        width: currentDrawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: currentDrawerWidth,
                            boxSizing: 'border-box',
                            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);", 
                            color: "white",
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'width 0.3s ease',
                            overflow: 'visible'
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
                            background: "radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73);",
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
                    width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
                    marginTop: isMobile ? '50px' : 0,
                    transition: 'width 0.3s ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}