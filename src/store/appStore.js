import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import axiosInstance from '../axios/axios';

export const useAppStore = create(
  persist(
    (set, get) => ({
      token: null,
      isLoading: false,
      error: null,
      isInitialized: false, 
      userDetails: null,
      isLoadingUserDetails: false,
      isUpdatingUserDetails: false,
      
      videos: [],
      isLoadingVideos: false,
      videoError: null,
      lastVideoEndpoint: null,
      
      likedVideos: [],
      isLoadingLikedVideos: false,
      likedVideoError: null,
      
      comments: [],
      isLoadingComments: false,
      commentError: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosInstance.post('/login', credentials)
          
          const { token, jobOption } = response.data
          
          const allowedJobOptions = ['Employer', 'Investor', 'placementDrive', 'Academy']
          
          if (!allowedJobOptions.includes(jobOption)) {
            set({ 
              isLoading: false,
              error: 'Access denied. This application is only available for Employers, Investors, Placement Drives, and Academy users.'
            })
            
            setTimeout(() => {
              window.location.href = '/'
            }, 3000)
            
            return { 
              success: false, 
              error: 'Access denied. This application is only available for Employers, Investors, Placement Drives, and Academy users.',
              redirect: true
            }
          }
          
          Cookies.set('wezume_auth_token', token, {
            expires: 0.5, 
            sameSite: 'strict'
          })
          
          set({ 
            token, 
            isLoading: false, 
            error: null 
          })
          
          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data.message || 'Login failed'
          console.log(error)
          set({ 
            isLoading: false, 
            error: errorMessage 
          })
          throw new Error(errorMessage)
        }
      },
      
      logout: () => {
        Cookies.remove('wezume_auth_token')
        set({ 
          token: null, 
          error: null, 
          userDetails: null,
          videos: [], 
          videoError: null,
          lastVideoEndpoint: null,
          likedVideos: [],
          likedVideoError: null,
          comments: [],
          commentError: null
        })
        window.location.href = '/login'
      },
      
      initialize: () => {
        const token = Cookies.get('wezume_auth_token')
        set({ 
          token: token || null, 
          isInitialized: true 
        })
      },
      
      clearError: () => set({ error: null }),
      
      isAuthenticated: () => {
        const { token } = get()
        return !!token || !!Cookies.get('wezume_auth_token')
      },
      
      getToken: () => {
        const { token } = get()
        return token || Cookies.get('wezume_auth_token')
      },
      
      getUserDetails: async () => {
        const { isAuthenticated, userDetails, isLoadingUserDetails } = get()
        
        if (!isAuthenticated()) {
          console.error('User not authenticated')
          return null
        }
        if (isLoadingUserDetails) {
          return userDetails
        }
        if (userDetails) {
          return userDetails
        }
        set({ isLoadingUserDetails: true, error: null })
        
        try {
          const response = await axiosInstance.get('/user-detail')
          const userData = response.data
          
          const allowedJobOptions = ['Employer', 'Investor', 'placementDrive', 'Academy']
          
          if (!allowedJobOptions.includes(userData.jobOption)) {
            set({ 
              isLoadingUserDetails: false,
              error: 'Access denied. This application is only available for Employers, Investors, Placement Drives, and Academy users.'
            })
            
            setTimeout(() => {
              get().logout()
            }, 2000)
            
            throw new Error('Access denied')
          }
          
          set({ 
            userDetails: userData, 
            isLoadingUserDetails: false 
          })
          
          return userData
        } catch (error) {
          
          set({ 
            isLoadingUserDetails: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch user details'
          })
          throw error
        }
      },
      
      updateUserDetails: async (updatedData, isFormData = false) => {
        const { isAuthenticated, userDetails, getToken } = get()
        
        if (!isAuthenticated()) {
          throw new Error('User not authenticated')
        }
        if (!userDetails?.userId) {
          throw new Error('User ID not available')
        }

        set({ isUpdatingUserDetails: true, error: null })
        
        try {
          const token = getToken()
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }

          if (!isFormData) {
            config.headers['Content-Type'] = 'application/json'
          }

          const response = await axiosInstance.put(
            `/users/update/${userDetails.userId}`, 
            updatedData,
            config
          )
          
          const updatedUserDetails = { ...userDetails, ...response.data }
          
          set({ 
            userDetails: updatedUserDetails,
            isUpdatingUserDetails: false 
          })
          
          return updatedUserDetails
        } catch (error) {
          const errorMessage = error.response?.data || 'Failed to update user details'
          set({ 
            isUpdatingUserDetails: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },
      
      clearUserDetails: () => set({ userDetails: null }),
      
      getVideos: async (forceRefresh = false) => {
        const { userDetails, videos, isLoadingVideos, lastVideoEndpoint } = get()
        
        if (!userDetails) {
          return []
        }

        const currentEndpoint = userDetails.jobOption === 'placementDrive' || userDetails.jobOption === 'Academy' 
          ? `/videos/job/${userDetails.jobid}`
          : '/videos/videos'
        
        if (!forceRefresh && videos.length > 0 && lastVideoEndpoint === currentEndpoint) {
          return videos
        }
        
        if (isLoadingVideos) {
          return videos 
        }
        
        set({ isLoadingVideos: true, videoError: null })
        
        try {
          const response = await axiosInstance.get(currentEndpoint)
          const rawVideoData = response.data || []
          
          const filteredVideoData = rawVideoData.filter(video => {
            return video && 
                   video.thumbnail && 
                   video.thumbnail.trim() !== '' &&
                   video.thumbnail !== null &&
                   video.thumbnail !== undefined
          })
          
          set({ 
            videos: filteredVideoData,
            isLoadingVideos: false,
            lastVideoEndpoint: currentEndpoint,
            videoError: null
          })
          
          return filteredVideoData
        } catch (error) {
          console.error('Error fetching videos:', error)
          const errorMessage = error.response?.data?.message || 'Failed to fetch videos'
          
          set({ 
            isLoadingVideos: false,
            videoError: errorMessage
          })
          
          return videos 
        }
      },
      
      clearVideos: () => set({ 
        videos: [], 
        videoError: null, 
        lastVideoEndpoint: null 
      }),
      
      refreshVideos: () => {
        const { getVideos } = get()
        return getVideos(true)
      },

      getLikedVideos: async (forceRefresh = false) => {
        const { userDetails, likedVideos, isLoadingLikedVideos } = get()
        
        if (!userDetails) {
          console.error('User details not available')
          return []
        }

        if (!forceRefresh && likedVideos.length > 0) {
          return likedVideos
        }
        
        if (isLoadingLikedVideos) {
          return likedVideos
        }
        
        set({ isLoadingLikedVideos: true, likedVideoError: null })
        
        try {
          const response = await axiosInstance.get('/videos/liked', {
            params: { userId: userDetails.userId }
          })
          const rawLikedVideoData = response.data || []
          
          const filteredLikedVideoData = rawLikedVideoData.filter(video => {
            return video && 
                   video.thumbnail && 
                   video.thumbnail.trim() !== '' &&
                   video.thumbnail !== null &&
                   video.thumbnail !== undefined
          })
          
          set({ 
            likedVideos: filteredLikedVideoData,
            isLoadingLikedVideos: false,
            likedVideoError: null
          })
          
          return filteredLikedVideoData
        } catch (error) {
          console.error('Error fetching liked videos:', error)
          const errorMessage = error.response?.data?.message || 'Failed to fetch liked videos'
          
          set({ 
            isLoadingLikedVideos: false,
            likedVideoError: errorMessage
          })
          
          return likedVideos
        }
      },
      
      clearLikedVideos: () => set({ 
        likedVideos: [], 
        likedVideoError: null 
      }),
      
      refreshLikedVideos: () => {
        const { getLikedVideos } = get()
        return getLikedVideos(true)
      },

      getComments: async (forceRefresh = false) => {
        const { userDetails, comments, isLoadingComments } = get()
        
        if (!userDetails?.userId) {
          return []
        }

        if (!forceRefresh && comments.length > 0) {
          return comments
        }
        
        if (isLoadingComments) {
          return comments
        }
        
        set({ isLoadingComments: true, commentError: null })
        
        try {
          const response = await axiosInstance.get(`/comments/userId?userId=${userDetails.userId}`)
          const commentData = response.data || []
          
          set({ 
            comments: commentData,
            isLoadingComments: false,
            commentError: null
          })
          
          return commentData
        } catch (error) {
          console.error('Error fetching comments:', error)
          const errorMessage = error.response?.data?.message || 'Failed to fetch comments'
          
          set({ 
            isLoadingComments: false,
            commentError: errorMessage
          })
          
          return comments
        }
      },

      addComment: async (videoId, comment) => {
        const { userDetails } = get()
        
        if (!userDetails) throw new Error('User not authenticated')
        
        try {
          await axiosInstance.post(`/comments/add`, null, {
            params: {
              userId: userDetails.userId,
              videoId: videoId,
              firstName: userDetails.firstName,
              comment: comment.trim()
            }
          })
          
          const { getComments } = get()
          await getComments(true)
        } catch (error) {
          console.error('Error adding comment:', error)
          throw error
        }
      },

      updateComment: async (commentId, newComment) => {
        const { userDetails } = get()
        
        if (!userDetails) throw new Error('User not authenticated')
        
        try {
          await axiosInstance.put(`/comments/edit/${commentId}`, null, {
            params: {
              userId: userDetails.userId,
              newComment: newComment.trim()
            }
          })
          
          const { getComments } = get()
          await getComments(true)
        } catch (error) {
          console.error('Error updating comment:', error)
          throw error
        }
      },

      deleteComment: async (commentId) => {
        const { userDetails } = get()
        
        if (!userDetails) throw new Error('User not authenticated')
        
        try {
          await axiosInstance.delete(`/comments/delete/${commentId}`, {
            params: {
              userId: userDetails.userId
            }
          })
          
          const { getComments } = get()
          await getComments(true)
        } catch (error) {
          console.error('Error deleting comment:', error)
          throw error
        }
      },
      
      clearComments: () => set({ 
        comments: [], 
        commentError: null 
      })
    }),
    {
      name: 'wezume-app-storage', 
      partialize: (state) => ({ 
        userDetails: state.userDetails,
        isInitialized: state.isInitialized
      }),
      storage: createJSONStorage(() => localStorage),
      version: 1, 
    }
  )
)