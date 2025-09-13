/* eslint-disable no-unused-vars */
import {
    Box, Container, Avatar, Typography, Paper, Grid, Chip, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, Skeleton, Fade,
    Slide, Card, CardContent, Snackbar, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UploadIcon from '@mui/icons-material/Upload';

export default function Profile() {
    const { userDetails, isLoadingUserDetails, updateUserDetails, isUpdatingUserDetails } = useAppStore();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [fileData, setFileData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();

    const collegeOptions = [
        'New Delhi',
        'Mumbai',
        'Bengaluru',
        'Chennai',
        'Hyderabad',
        'Pune',
        'Kolkata'
    ];

    const educationOptions = [
        'Banking & Finance',
        'Biotechnology',
        'Construction',
        'Consumer Goods',
        'Education',
        'Energy',
        'Healthcare',
        'Media & Entertainment',
        'Hospitality',
        'Information Technology (IT)',
        'Insurance',
        'Manufacturing',
        'Non-Profit',
        'Real Estate',
        'Retail',
        'Transportation',
        'Travel & Tourism',
        'Textiles',
        'Logistics & Supply Chain',
        'Sports',
        'E-commerce',
        'Consulting',
        'Advertising & Marketing',
        'Architecture',
        'Arts & Design',
        'Environmental Services',
        'Human Resources',
        'Legal',
        'Management',
        'Telecommunications'
    ];
    
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

    const displayValue = (value) => value !== null && value !== undefined && value !== '' ? value : 'NA';
    
    const getProfileImage = () => {
        if (fileData) return fileData;
        return userDetails.profilepicurl || null;
    };

    const isEmployerOrInvestor = () => userDetails.roleCode === 'employer' || userDetails.roleCode === 'investor';
    const isPlacementOrAcademy = () => userDetails.roleCode === 'placementDrive' || userDetails.roleCode === 'academy';

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setSnackbar({ open: true, message: 'File size too large. Please select an image under 5MB.', severity: 'error' });
                return;
            }
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setSnackbar({ open: true, message: 'Please select a valid image file (JPEG, PNG, GIF, or WebP).', severity: 'error' });
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFileData(reader.result);
            };
            reader.onerror = () => {
                setSnackbar({ open: true, message: 'Error reading file. Please try again.', severity: 'error' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        if (isEmployerOrInvestor()) {
            setEditData({
                firstName: userDetails.firstName || '', 
                lastName: userDetails.lastName || '',
                phoneNumber: userDetails.phoneNumber || '', 
                email: userDetails.email || '',
                currentEmployer: userDetails.currentEmployer || '',
                industry: userDetails.industry || '',
                city: userDetails.city || '',
                establishedYear: userDetails.establishedYear || ''
            });
        } else if (isPlacementOrAcademy()) {
            setEditData({
                firstName: userDetails.firstName || '', 
                lastName: userDetails.lastName || '',
                phoneNumber: userDetails.phoneNumber || '', 
                email: userDetails.email || '',
                college: userDetails.college || '',
                branch: userDetails.branch || ''
            });
        } else {
            setEditData({
                firstName: userDetails.firstName || '', 
                lastName: userDetails.lastName || '',
                phoneNumber: userDetails.phoneNumber || '',
                email: userDetails.email || '',
                industry: userDetails.industry || '',
                currentEmployer: userDetails.currentEmployer || '',
                city: userDetails.city || ''
            });
        }
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            let updatedData = { ...editData };

            if (selectedFile && !isPlacementOrAcademy()) {
                const formData = new FormData();
                
                Object.keys(updatedData).forEach(key => {
                    if (updatedData[key] !== undefined && updatedData[key] !== null && updatedData[key] !== '') {
                        formData.append(key, updatedData[key]);
                    }
                });
                
                formData.append('profilePic', selectedFile);

                await updateUserDetails(formData, true);
            } else {
                const filteredData = Object.keys(updatedData).reduce((acc, key) => {
                    if (updatedData[key] !== undefined && updatedData[key] !== null && updatedData[key] !== '') {
                        acc[key] = updatedData[key];
                    }
                    return acc;
                }, {});

                if (Object.keys(filteredData).length > 0) {
                    await updateUserDetails(filteredData, false);
                }
            }

            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            
            setTimeout(() => {
                setEditMode(false);
                setFileData(null);
                setSelectedFile(null);
                setSnackbar({ open: false, message: '', severity: 'success' });
            }, 2000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({ open: true, message: error.message || 'Failed to update profile', severity: 'error' });
            
            setTimeout(() => {
                setEditMode(false);
                setSnackbar({ open: false, message: '', severity: 'error' });
            }, 2000);
        }
    };

    const handleCancel = () => { 
        setEditMode(false); 
        setEditData({}); 
        setFileData(null);
        setSelectedFile(null);
    };
    
    const handleChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));
    const profileImage = getProfileImage();

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': { 
            borderRadius: 3, 
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
        },
        '& .MuiInputLabel-root': { fontWeight: 500 }
    };

    const InfoCard = ({ icon, title, value, color = '#1CA7EC' }) => (
        <Card elevation={2} sx={{ 
            height: '100%', borderRadius: 3, transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
            border: `1px solid ${color}15`
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                        backgroundColor: `${color}15`, borderRadius: 2, p: 1, mr: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ 
                    fontWeight: 500, color: value === 'NA' ? '#95a5a6' : '#2c3e50', wordBreak: 'break-word'
                }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    const renderTextField = (label, field, props = {}) => (
        <TextField
            fullWidth 
            label={label} 
            value={editData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            sx={textFieldStyle} 
            {...props}
        />
    );

    const renderSelectField = (label, field, options) => (
        <FormControl fullWidth sx={textFieldStyle}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={editData[field] || ''}
                label={label}
                onChange={(e) => handleChange(field, e.target.value)}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const renderEditFields = () => {
        if (isEmployerOrInvestor()) {
            return (
                <>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("First Name", "firstName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Last Name", "lastName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Phone Number", "phoneNumber")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Email", "email", { type: "email" })}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Company Name", "currentEmployer")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderSelectField("Industry", "industry", educationOptions)}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderSelectField("City", "city", collegeOptions)}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Established Year", "establishedYear", { type: "number", inputProps: { min: 1900, max: new Date().getFullYear() } })}</Grid>
                </>
            );
        } else if (isPlacementOrAcademy()) {
            return (
                <>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("First Name", "firstName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Last Name", "lastName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Phone Number", "phoneNumber")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Email", "email", { type: "email" })}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Organization Name", "college")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Branch", "branch")}</Grid>
                </>
            );
        } else {
            return (
                <>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("First Name", "firstName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Last Name", "lastName")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Phone Number", "phoneNumber")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Email", "email", { type: "email" })}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderSelectField("Industry", "industry", educationOptions)}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderTextField("Current Employer", "currentEmployer")}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{renderSelectField("City", "city", collegeOptions)}</Grid>
                </>
            );
        }
    };

    const hasValue = (value) => value && value !== 'NA' && value !== '';

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
            <Slide direction="down" in={!isLoadingUserDetails} mountOnEnter unmountOnExit>
                <Box>
                    <Paper elevation={4} sx={{ 
                        p: 4, borderRadius: 4, color: 'white', position: 'relative', overflow: 'hidden', mb: 4,
                        background: 'radial-gradient(circle at top left, #cce0ff, #0066FF, #002d73)'
                    }}>
                        <Box sx={{ 
                            position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                            background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                        }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>Profile</Typography>
                            <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 600,
                                    borderRadius: 3, px: { xs: 2, sm: 3 }, py: { xs: 0.8, sm: 1.5 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 'auto' },
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', transform: 'translateY(-2px)' },
                                    transition: 'all 0.3s ease'
                                }}>
                                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Edit Profile</Box>
                                <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Edit</Box>
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                            <Avatar src={profileImage} sx={{
                                width: 120, height: 120, border: '4px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                            }}>
                                {!profileImage && <PersonIcon sx={{ fontSize: 60 }} />}
                            </Avatar>
                            
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                                    {userDetails.firstName || 'User'} {userDetails.lastName || ''}
                                </Typography>
                                
                                {hasValue(userDetails.email) && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                            {userDetails.email}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {hasValue(userDetails.phoneNumber) && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {userDetails.phoneNumber}
                                        </Typography>
                                    </Box>
                                )}

                                {hasValue(userDetails.industry) && (
                                    <Chip icon={<StarIcon />} label={userDetails.industry} sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600,
                                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
                                    }} />
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                                Professional Information
                            </Typography>
                        </Grid>
                        
                        {hasValue(userDetails.jobOption) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<WorkIcon sx={{ color: '#e74c3c' }} />} title="Job Option"
                                    value={userDetails.jobOption} color="#e74c3c" />
                            </Grid>
                        )}

                        {hasValue(userDetails.currentRole) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<PersonIcon sx={{ color: '#f39c12' }} />} title="Current Role"
                                    value={userDetails.currentRole} color="#f39c12" />
                            </Grid>
                        )}

                        {hasValue(userDetails.experience) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<StarIcon sx={{ color: '#16a085' }} />} title="Experience"
                                    value={userDetails.experience} color="#16a085" />
                            </Grid>
                        )}

                        {hasValue(userDetails.currentEmployer) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<BusinessIcon sx={{ color: '#9b59b6' }} />} title="Current Employer"
                                    value={userDetails.currentEmployer} color="#9b59b6" />
                            </Grid>
                        )}

                        {hasValue(userDetails.industry) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<BusinessIcon sx={{ color: '#27ae60' }} />} title="Industry"
                                    value={userDetails.industry} color="#27ae60" />
                            </Grid>
                        )}

                        {hasValue(userDetails.keySkills) && (
                            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                                <InfoCard icon={<StarIcon sx={{ color: '#3498db' }} />} title="Key Skills"
                                    value={userDetails.keySkills} color="#3498db" />
                            </Grid>
                        )}

                        {hasValue(userDetails.city) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<LocationOnIcon sx={{ color: '#e67e22' }} />} title="City"
                                    value={userDetails.city} color="#e67e22" />
                            </Grid>
                        )}

                        {hasValue(userDetails.establishedYear) && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <InfoCard icon={<BusinessIcon sx={{ color: '#8e44ad' }} />} title="Established Year"
                                    value={userDetails.establishedYear} color="#8e44ad" />
                            </Grid>
                        )}

                        {!isEmployerOrInvestor() && (hasValue(userDetails.college) || hasValue(userDetails.branch) || hasValue(userDetails.education)) && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, mt: 4 }}>
                                        Education & Background
                                    </Typography>
                                </Grid>

                                {hasValue(userDetails.college) && (
                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                        <InfoCard icon={<SchoolIcon sx={{ color: '#e67e22' }} />} title="College"
                                            value={userDetails.college} color="#e67e22" />
                                    </Grid>
                                )}

                                {hasValue(userDetails.education) && (
                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                        <InfoCard icon={<SchoolIcon sx={{ color: '#2ecc71' }} />} title="Education"
                                            value={userDetails.education} color="#2ecc71" />
                                    </Grid>
                                )}

                                {hasValue(userDetails.branch) && (
                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                        <InfoCard icon={<SchoolIcon sx={{ color: '#3498db' }} />} title="Branch"
                                            value={userDetails.branch} color="#3498db" />
                                    </Grid>
                                )}
                            </>
                        )}
                    </Grid>
                </Box>
            </Slide>

            <Dialog open={editMode} onClose={handleCancel} maxWidth="md" fullWidth
                slotProps={{ paper: { sx: { borderRadius: 4, maxHeight: '85vh', overflow: 'auto' }}}}>
                <DialogTitle sx={{ 
                    borderBottom: '2px solid #f0f4f8', fontWeight: 700, fontSize: '1.75rem',
                    color: '#1e293b', py: 3, px: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    position: 'sticky', top: 0, zIndex: 1
                }}>
                    Edit Profile Information
                </DialogTitle>
                <DialogContent sx={{ pt: 4, pb: 2, px: 4, backgroundColor: '#fafbfc' }}>
                    {!isPlacementOrAcademy() && (
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Avatar
                                src={fileData || profileImage}
                                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, cursor: 'pointer' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {!fileData && !profileImage && <PersonIcon sx={{ fontSize: 50 }} />}
                            </Avatar>
                            <Button
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{ borderRadius: 2 }}
                            >
                                Upload Picture
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Selected: {selectedFile.name}
                                </Typography>
                            )}
                        </Box>
                    )}
                    <Grid container spacing={3}>{renderEditFields()}</Grid>
                </DialogContent>
                <DialogActions sx={{ 
                    p: 4, borderTop: '2px solid #f0f4f8', gap: 2, justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    position: 'sticky', bottom: 0, zIndex: 1
                }}>
                    <Button onClick={handleCancel} variant="outlined" size="small" sx={{ 
                        borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, fontSize: '0.875rem',
                        color: '#64748b', borderColor: '#cbd5e1', borderWidth: '2px',
                        '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc', borderWidth: '2px' },
                        transition: 'all 0.2s ease'
                    }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={isUpdatingUserDetails} size="small"
                        sx={{ 
                            borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, fontSize: '0.875rem',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                            '&:hover': { 
                                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.5)', transform: 'translateY(-2px)'
                            },
                            '&:disabled': { background: '#cbd5e1', color: '#64748b', boxShadow: 'none' },
                            transition: 'all 0.3s ease'
                        }}>
                        {isUpdatingUserDetails ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    width: 14, height: 14, border: '2px solid #ffffff', borderTop: '2px solid transparent',
                                    borderRadius: '50%', animation: 'spin 1s linear infinite',
                                    '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' }}
                                }} />
                                Saving...
                            </Box>
                        ) : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}