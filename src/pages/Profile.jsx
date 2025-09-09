import {
    Box, 
    Container,
    Avatar,
    Typography,
    Paper,
    Grid,
    Chip,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Skeleton,
    Fade,
    Slide,
    IconButton,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';

export default function Profile() {
    const { userDetails, isLoadingUserDetails, updateUserDetails, isUpdatingUserDetails } = useAppStore();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
    console.log('User Details:', userDetails);
    if (isLoadingUserDetails) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Fade in={isLoadingUserDetails}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Skeleton variant="circular" width={140} height={140} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto', mb: 1 }} />
                            <Skeleton variant="text" width={150} height={20} sx={{ mx: 'auto' }} />
                        </Box>
                        <Grid container spacing={3}>
                            {[...Array(6)].map((_, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Fade>
            </Container>
        );
    }

    if (!userDetails) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card elevation={3} sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
                    <PersonIcon sx={{ fontSize: 80, color: '#bdc3c7', mb: 2 }} />
                    <Typography variant="h5" color="textSecondary">
                        No profile information available
                    </Typography>
                </Card>
            </Container>
        );
    }

    const displayValue = (value) => {
        return value !== null && value !== undefined && value !== '' ? value : 'NA';
    };

    const getProfileImage = () => {
        if (userDetails.profilePic) {
            if (userDetails.profilePic.startsWith('data:image')) {
                return userDetails.profilePic;
            }
            return `data:image/jpeg;base64,${userDetails.profilePic}`;
        }
        return null;
    };

    const handleEdit = () => {
        setEditData({
            firstName: userDetails.firstName || '',
            phoneNumber: userDetails.phoneNumber || '',
            email: userDetails.email || '',
            jobOption: userDetails.jobOption || '',
            currentRole: userDetails.currentRole || '',
            industry: userDetails.industry || '',
            currentEmployer: userDetails.currentEmployer || '',
            keySkills: userDetails.keySkills || '',
            college: userDetails.college || '',
            establishedYear: userDetails.establishedYear || ''
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            await updateUserDetails(editData);
            setAlert({
                show: true,
                message: 'Profile updated successfully!',
                severity: 'success'
            });
            setEditMode(false);
        } catch (error) {
            setAlert({
                show: true,
                message: error.message || 'Failed to update profile',
                severity: 'error'
            });
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditData({});
    };

    const handleChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const profileImage = getProfileImage();

    const InfoCard = ({ icon, title, value, color = '#1CA7EC' }) => (
        <Card 
            elevation={2} 
            sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                },
                border: `1px solid ${color}15`
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                        sx={{ 
                            backgroundColor: `${color}15`,
                            borderRadius: 2,
                            p: 1,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        fontWeight: 500,
                        color: value === 'NA' ? '#95a5a6' : '#2c3e50',
                        wordBreak: 'break-word'
                    }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
            <Slide direction="down" in={!isLoadingUserDetails} mountOnEnter unmountOnExit>
                <Box>
                    {alert.show && (
                        <Fade in={alert.show}>
                            <Alert 
                                severity={alert.severity}
                                onClose={() => setAlert({ ...alert, show: false })}
                                sx={{ 
                                    mb: 3,
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        fontSize: '1.5rem'
                                    }
                                }}
                            >
                                {alert.message}
                            </Alert>
                        </Fade>
                    )}

                    <Paper 
                        elevation={4} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            background: 'radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            mb: 4
                        }}
                    >
                        <Box 
                            sx={{ 
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%'
                            }} 
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                                Profile
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                            <Avatar
                                src={profileImage}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                }}
                            >
                                {!profileImage && <PersonIcon sx={{ fontSize: 60 }} />}
                            </Avatar>
                            
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                                    {userDetails.firstName || 'User'}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        {displayValue(userDetails.email)}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                        {displayValue(userDetails.phoneNumber)}
                                    </Typography>
                                </Box>

                                {userDetails.industry && userDetails.industry !== 'NA' && (
                                    <Chip 
                                        icon={<StarIcon />}
                                        label={userDetails.industry}
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)'
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* Professional Information */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                                Professional Information
                            </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InfoCard
                                icon={<WorkIcon sx={{ color: '#e74c3c' }} />}
                                title="Job Option"
                                value={displayValue(userDetails.jobOption)}
                                color="#e74c3c"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InfoCard
                                icon={<PersonIcon sx={{ color: '#f39c12' }} />}
                                title="Current Role"
                                value={displayValue(userDetails.currentRole)}
                                color="#f39c12"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InfoCard
                                icon={<BusinessIcon sx={{ color: '#9b59b6' }} />}
                                title="Current Employer"
                                value={displayValue(userDetails.currentEmployer)}
                                color="#9b59b6"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InfoCard
                                icon={<BusinessIcon sx={{ color: '#27ae60' }} />}
                                title="Industry"
                                value={displayValue(userDetails.industry)}
                                color="#27ae60"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                            <InfoCard
                                icon={<StarIcon sx={{ color: '#3498db' }} />}
                                title="Key Skills"
                                value={displayValue(userDetails.keySkills)}
                                color="#3498db"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, mt: 4 }}>
                                Education & Background
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <InfoCard
                                icon={<SchoolIcon sx={{ color: '#e67e22' }} />}
                                title="College"
                                value={displayValue(userDetails.college)}
                                color="#e67e22"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <InfoCard
                                icon={<CalendarTodayIcon sx={{ color: '#34495e' }} />}
                                title="Established Year"
                                value={displayValue(userDetails.establishedYear)}
                                color="#34495e"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Card 
                                elevation={3} 
                                sx={{ 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    mt: 2
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <VideoLibraryIcon sx={{ mr: 2, fontSize: 32 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Videos
                                        </Typography>
                                    </Box>
                                    {userDetails.videos && userDetails.videos.length > 0 ? (
                                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                            {userDetails.videos.length} video(s) uploaded
                                        </Typography>
                                    ) : (
                                        <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                            No videos uploaded yet
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Slide>

            <Dialog 
                open={editMode} 
                onClose={handleCancel} 
                maxWidth="md" 
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            maxHeight: '90vh'
                        }
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem'
                }}>
                    Edit Profile
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={editData.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={editData.phoneNumber || ''}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Job Option"
                                value={editData.jobOption || ''}
                                onChange={(e) => handleChange('jobOption', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Current Role"
                                value={editData.currentRole || ''}
                                onChange={(e) => handleChange('currentRole', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Industry"
                                value={editData.industry || ''}
                                onChange={(e) => handleChange('industry', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Current Employer"
                                value={editData.currentEmployer || ''}
                                onChange={(e) => handleChange('currentEmployer', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Established Year"
                                type="number"
                                value={editData.establishedYear || ''}
                                onChange={(e) => handleChange('establishedYear', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Key Skills"
                                multiline
                                rows={3}
                                value={editData.keySkills || ''}
                                onChange={(e) => handleChange('keySkills', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="College"
                                value={editData.college || ''}
                                onChange={(e) => handleChange('college', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={handleCancel}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained"
                        disabled={isUpdatingUserDetails}
                        sx={{ 
                            background: 'radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            '&:hover': { 
                                background: 'radial-gradient(circle at top left, #b3d1ff, #0052cc, #001f59)'
                            }
                        }}
                    >
                        {isUpdatingUserDetails ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}