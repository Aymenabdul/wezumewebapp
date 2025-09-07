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

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosInstance.post('/api/login', credentials)
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
          userDetails: null 
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
          const response = await axiosInstance.get('/api/user-detail')
          const userData = response.data
          
          set({ 
            userDetails: userData, 
            isLoadingUserDetails: false 
          })
          
          return userData
        } catch (error) {
          console.error('Failed to fetch user details:', error)
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

      clearUserDetails: () => set({ userDetails: null })
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