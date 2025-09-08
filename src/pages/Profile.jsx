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
    Alert
} from '@mui/material';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

export default function Profile() {
    const { userDetails, isLoadingUserDetails, updateUserDetails, isUpdatingUserDetails } = useAppStore();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
    console.log(userDetails);
    if (isLoadingUserDetails) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h6" align="center">
                    Loading profile...
                </Typography>
            </Container>
        );
    }

    if (!userDetails) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h6" align="center">
                    No profile information available
                </Typography>
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

    return (
        <Container maxWidth="md" sx={{ py: 4, minHeight: "100vh" }}>
            {alert.show && (
                <Alert 
                    severity={alert.severity}
                    onClose={() => setAlert({ ...alert, show: false })}
                    sx={{ mb: 2 }}
                >
                    {alert.message}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        Profile
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                            bgcolor: '#1CA7EC',
                            '&:hover': { bgcolor: '#1590D3' }
                        }}
                    >
                        Edit Profile
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        src={profileImage}
                        sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 2,
                            border: '4px solid #1CA7EC',
                            boxShadow: '0 4px 20px rgba(28, 167, 236, 0.3)'
                        }}
                    >
                        {!profileImage && <PersonIcon sx={{ fontSize: 60 }} />}
                    </Avatar>
                    
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        {userDetails.firstName || 'User'}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                        {displayValue(userDetails.email)}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#95a5a6' }}>
                        {displayValue(userDetails.phoneNumber)}
                    </Typography>

                    {userDetails.industry && userDetails.industry !== 'NA' && (
                        <Chip 
                            label={userDetails.industry}
                            sx={{ 
                                mt: 2,
                                bgcolor: '#1CA7EC',
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                                Professional Information
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Job Option:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.jobOption)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Current Role:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.currentRole)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Current Employer:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.currentEmployer)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Key Skills:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.keySkills)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                                Education & Background
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    College:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.college)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Industry:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.industry)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                                    Established Year:
                                </Typography>
                                <Typography variant="body1">
                                    {displayValue(userDetails.establishedYear)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                                Videos
                            </Typography>
                            {userDetails.videos && userDetails.videos.length > 0 ? (
                                <Typography variant="body1">
                                    {userDetails.videos.length} video(s) uploaded
                                </Typography>
                            ) : (
                                <Typography variant="body1" sx={{ color: '#95a5a6' }}>
                                    No videos uploaded yet
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={editMode} onClose={handleCancel} maxWidth="md" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={editData.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={editData.phoneNumber || ''}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Job Option"
                                value={editData.jobOption || ''}
                                onChange={(e) => handleChange('jobOption', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Current Role"
                                value={editData.currentRole || ''}
                                onChange={(e) => handleChange('currentRole', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Industry"
                                value={editData.industry || ''}
                                onChange={(e) => handleChange('industry', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Current Employer"
                                value={editData.currentEmployer || ''}
                                onChange={(e) => handleChange('currentEmployer', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Established Year"
                                type="number"
                                value={editData.establishedYear || ''}
                                onChange={(e) => handleChange('establishedYear', e.target.value)}
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
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="College"
                                value={editData.college || ''}
                                onChange={(e) => handleChange('college', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained"
                        disabled={isUpdatingUserDetails}
                        sx={{ bgcolor: '#1CA7EC', '&:hover': { bgcolor: '#1590D3' } }}
                    >
                        {isUpdatingUserDetails ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};