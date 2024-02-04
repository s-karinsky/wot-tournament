import { useQuery } from '@tanstack/react-query'
import axios from './axios'

export const useProfile = () => useQuery({
  queryKey: ['profile'],
  queryFn: async () => {
    try {
      const profile = await axios.get('/api/user/profile')
      return profile.data?.user
    } catch (e) {
      return null
    }
  }
})

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/users')
      return response.data?.users || []
    } catch (e) {
      return []
    }
  }
})

export const useClans = () => useQuery({
  queryKey: ['clans'],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/clans')
      return response.data?.clans || []
    } catch (e) {
      return []
    }
  }
})