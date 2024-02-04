import { useQuery } from '@tanstack/react-query'
import axios from './axios'

export const useUser = () => useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    try {
      const profile = await axios.get('/api/user/profile')
      return profile.data?.user
    } catch (e) {
      return null
    }
  }
})