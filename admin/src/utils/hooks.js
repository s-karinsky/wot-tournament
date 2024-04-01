import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import axios from './axios'
import { RESERVE_TYPES } from '../consts'

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

export const useUsers = (id) => useQuery({
  queryKey: ['users', id],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/users', { params: { id } })
      if (id) {
        if (response.data?.ban?.id) {
          response.data.ban.banned = true
          response.data.ban.endDate = dayjs(response.data.ban.endDate)
        }
        if (response.data?.user?.violations) {
          response.data.user.violations = response.data?.user?.violations.map(item => ({ ...item, date: dayjs(item.date) }))
        }
        const restrictForm = (response.data?.user?.restrictions || []).reduce((acc, item) => ({
          ...acc,
          [item.type]: true,
          [`${item.type}_date`]: dayjs(item.date)
        }), {})
        response.data.restrictions = restrictForm
      }
      return id ? (response.data || {}) : (response.data?.users || [])
    } catch (e) {
      return []
    }
  }
})

export const useClans = (id) => useQuery({
  queryKey: ['clans', id],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/clans', { params: { id } })
      if (id) {
        if (response.data?.ban?.id) {
          response.data.ban.banned = true
          response.data.ban.endDate = dayjs(response.data.ban.endDate)
        }
      }
      return id ? (response.data || {}) : (response.data?.clans || [])
    } catch (e) {
      return []
    }
  }
})

export const useModerators = (id) => useQuery({
  queryKey: ['moderators', id],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/moderator', { params: { id } })
      return id ? (response.data?.moderator || {}) : (response.data?.moderators || [])
    } catch (e) {
      return []
    }
  }
})

export const useSettings = () => useQuery({
  queryKey: ['settings'],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/settings')
      const settings =  (response.data?.settings || [])
      const res = settings.reduce((acc, item) => ({
        ...acc,
        [item.key]: item
      }), {})
      console.log(res)
      if (res.forumActiveThreadAge?.forumActiveThreadAge) {
        res.forumActiveThreadAge.forumActiveThreadAge = res.forumActiveThreadAge.forumActiveThreadAge / (60 * 60 * 1000)
      }
      return res
    } catch (e) {
      return {}
    }
  }
})

export const useReserves = () => useQuery({
  queryKey: ['reserves'],
  queryFn: async () => {
    try {
      const response = await axios.get('/api/admin/reserves')
      const list = (response.data?.data || []).filter(item => RESERVE_TYPES.includes(item.type))
      const initialValues = response.data?.initialValues || {}
      return {
        list,
        initialValues
      }
    } catch (e) {
      return {}
    }
  }
})