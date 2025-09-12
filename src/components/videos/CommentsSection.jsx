import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Divider, 
  TextField, 
  IconButton,
  CircularProgress,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import { Send, MoreVert, Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export default function CommentsSection({ videoId }) {
  const { 
    userDetails, 
    comments, 
    isLoadingComments,
    getComments,
    addComment,
    updateComment,
    deleteComment
  } = useAppStore();
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (userDetails) {
      getComments();
    }
  }, []);

  const videoComments = comments.filter(comment => comment.videoId === parseInt(videoId));
  const hasUserCommented = videoComments.length > 0;

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userDetails || isSubmitting || hasUserCommented) return;
    
    setIsSubmitting(true);
    try {
      await addComment(videoId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleEdit = () => {
    setEditingComment(selectedComment.id);
    setEditText(selectedComment.comment);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      await updateComment(editingComment, editText);
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleDelete = async () => {
    try {
      await deleteComment(selectedComment.id);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getProfileImage = () => {
    if (!userDetails?.profilePic) return null;
    if (userDetails.profilePic.startsWith('https://')) return userDetails.profilePic;
    if (userDetails.profilePic.startsWith('data:image')) return userDetails.profilePic;
    try {
      return `data:image/jpeg;base64,${userDetails.profilePic}`;
    } catch {
      return null;
    }
  };

  const formatTime = (createdDate) => {
    const date = new Date(createdDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  if (isLoadingComments) {
    return (
      <Paper sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading comments...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }} elevation={0}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: '#1f2937',
          fontSize: '1.125rem'
        }}>
          Comments
        </Typography>
        <Chip 
          label={videoComments.length} 
          size="small" 
          sx={{ 
            bgcolor: '#f3f4f6', 
            color: '#6b7280',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 20
          }} 
        />
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
        {videoComments.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#9ca3af'
          }}>
            <Typography>No comments yet</Typography>
          </Box>
        ) : (
          videoComments.map((comment, index) => (
            <Box key={comment.id}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 2,
                  '&:hover .comment-actions': {
                    opacity: 1
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: '#4f46e5',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {comment.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      fontSize: '0.875rem'
                    }}>
                      {comment.firstName || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#9ca3af', 
                      fontSize: '0.75rem'
                    }}>
                      {formatTime(comment.createdDate)}
                    </Typography>
                    <IconButton
                      size="small"
                      className="comment-actions"
                      onClick={(e) => handleMenuOpen(e, comment)}
                      sx={{ 
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        ml: 'auto'
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  {editingComment === comment.id ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                      <IconButton size="small" onClick={handleSaveEdit}>
                        <Send fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancelEdit}>
                        ✕
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ 
                      color: '#4b5563',
                      lineHeight: 1.5,
                      fontSize: '0.875rem'
                    }}>
                      {comment.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < videoComments.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))
        )}
      </Box>

      <Box sx={{
        border: hasUserCommented ? '1px solid #e5e7eb' : '1px solid #d1d5db',
        borderRadius: 2,
        p: 2,
        bgcolor: hasUserCommented ? '#f9fafb' : '#ffffff',
        opacity: hasUserCommented ? 0.6 : 1
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar 
            src={getProfileImage()}
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: '#4f46e5',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {userDetails?.firstName?.charAt(0) || 'U'}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={hasUserCommented ? "You have already commented on this video" : "Add a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || hasUserCommented}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4f46e5',
                    borderWidth: 1
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#f9fafb'
                  }
                },
                '& .MuiInputBase-input': {
                  color: '#374151',
                  '&::placeholder': {
                    color: '#9ca3af',
                    opacity: 1
                  },
                  '&.Mui-disabled': {
                    color: '#9ca3af'
                  }
                }
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 1
            }}>
              <IconButton
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting || hasUserCommented}
                size="small"
                sx={{
                  bgcolor: (newComment.trim() && !hasUserCommented) ? '#4f46e5' : '#e5e7eb',
                  color: (newComment.trim() && !hasUserCommented) ? 'white' : '#9ca3af',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: (newComment.trim() && !hasUserCommented) ? '#4338ca' : '#e5e7eb'
                  },
                  '&:disabled': {
                    bgcolor: '#e5e7eb',
                    color: '#9ca3af'
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={14} sx={{ color: 'inherit' }} />
                ) : (
                  <Send sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}