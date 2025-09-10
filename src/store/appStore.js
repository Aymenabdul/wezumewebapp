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
      
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosInstance.post('/login', credentials)
          
          const { token } = response.data
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
          const errorMessage = error.response?.data?.message || 'Login failed'
          
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
          likedVideoError: null
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
          
          set({ 
            userDetails: userData, 
            isLoadingUserDetails: false 
          })
          
          return userData
        } catch (error) {
          
          set({ 
            isLoadingUserDetails: false,
            error: error.response?.data?.message || 'Failed to fetch user details'
          })
          throw error
        }
      },
      
      updateUserDetails: async (updatedData) => {
        const { isAuthenticated, userDetails } = get()
        
        if (!isAuthenticated()) {
          throw new Error('User not authenticated')
        }
        if (!userDetails?.userId) {
          throw new Error('User ID not available')
        }
        const allowedFields = [
          'firstName', 'phoneNumber', 'email', 'jobOption', 'profilePic',
          'currentRole', 'industry', 'keySkills', 
          'college', 'currentEmployer', 'establishedYear'
        ]
        const filteredData = Object.keys(updatedData)
          .filter(key => allowedFields.includes(key) && updatedData[key] !== undefined)
          .reduce((obj, key) => {
            obj[key] = updatedData[key]
            return obj
          }, {})
        if (Object.keys(filteredData).length === 0) {
          throw new Error('No valid fields to update')
        }
        set({ isUpdatingUserDetails: true, error: null })
        try {
          const response = await axiosInstance.put(
            `/users/update/${userDetails.userId}`, 
            filteredData
          )
          const updatedUserDetails = { ...userDetails, ...response.data }
          
          set({ 
            userDetails: updatedUserDetails,
            isUpdatingUserDetails: false 
          })
          return updatedUserDetails
        } catch (error) {
          console.error('Failed to update user details:', error)
          const errorMessage = error.response?.data?.message || 'Failed to update user details'
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
          console.error('User details not available')
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
          const videoData = response.data || []
          
          set({ 
            videos: videoData,
            isLoadingVideos: false,
            lastVideoEndpoint: currentEndpoint,
            videoError: null
          })
          
          return videoData
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
          const likedVideoData = response.data || []
          
          set({ 
            likedVideos: likedVideoData,
            isLoadingLikedVideos: false,
            likedVideoError: null
          })
          
          return likedVideoData
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
      }
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