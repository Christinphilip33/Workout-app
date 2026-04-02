import { useState, useEffect, useCallback } from 'react'

/**
 * Multi-user profile management hook
 * All data stored locally in localStorage - no backend, no cost
 */

const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUserId'

// Generate a simple unique ID
const generateId = () => `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function useUserProfile() {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load users and current user on mount
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem(USERS_KEY)
        const storedCurrentId = localStorage.getItem(CURRENT_USER_KEY)

        let userList = storedUsers ? JSON.parse(storedUsers) : []

        // Migration: if no users exist but old data exists, create default user
        if (userList.length === 0) {
          const hasOldData = localStorage.getItem('sessions') ||
                            localStorage.getItem('workoutLogs') ||
                            localStorage.getItem('userProgress')

          if (hasOldData) {
            // Migrate existing data to a default user
            const defaultUser = {
              id: generateId(),
              name: 'Default User',
              createdAt: new Date().toISOString()
            }
            userList = [defaultUser]
            localStorage.setItem(USERS_KEY, JSON.stringify(userList))

            // Migrate old data to namespaced keys
            const oldKeys = ['sessions', 'workoutLogs', 'userProgress', 'weightUnit', 'restTimerDuration']
            oldKeys.forEach(key => {
              const oldData = localStorage.getItem(key)
              if (oldData) {
                localStorage.setItem(`user_${defaultUser.id}_${key}`, oldData)
                // Don't delete old keys yet - keep as backup
              }
            })

            localStorage.setItem(CURRENT_USER_KEY, defaultUser.id)
            setCurrentUserId(defaultUser.id)
          }
        }

        setUsers(userList)

        // Set current user
        if (storedCurrentId && userList.find(u => u.id === storedCurrentId)) {
          setCurrentUserId(storedCurrentId)
        } else if (userList.length > 0) {
          setCurrentUserId(userList[0].id)
          localStorage.setItem(CURRENT_USER_KEY, userList[0].id)
        }
      } catch (err) {
        console.error('Error loading user profiles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Get current user object
  const currentUser = users.find(u => u.id === currentUserId) || null

  // Create a new user
  const createUser = useCallback((name) => {
    const newUser = {
      id: generateId(),
      name: name.trim() || 'New User',
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

    // Auto-switch to new user
    setCurrentUserId(newUser.id)
    localStorage.setItem(CURRENT_USER_KEY, newUser.id)

    return newUser
  }, [users])

  // Switch to a different user
  const switchUser = useCallback((userId) => {
    if (users.find(u => u.id === userId)) {
      setCurrentUserId(userId)
      localStorage.setItem(CURRENT_USER_KEY, userId)
    }
  }, [users])

  // Delete a user and their data
  const deleteUser = useCallback((userId) => {
    if (users.length <= 1) {
      console.warn('Cannot delete the last user')
      return false
    }

    // Remove user from list
    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

    // Delete user's namespaced data
    const userKeys = ['sessions', 'workoutLogs', 'userProgress', 'weightUnit', 'restTimerDuration']
    userKeys.forEach(key => {
      localStorage.removeItem(`user_${userId}_${key}`)
    })

    // If deleting current user, switch to another
    if (userId === currentUserId && updatedUsers.length > 0) {
      setCurrentUserId(updatedUsers[0].id)
      localStorage.setItem(CURRENT_USER_KEY, updatedUsers[0].id)
    }

    return true
  }, [users, currentUserId])

  // Rename a user
  const renameUser = useCallback((userId, newName) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, name: newName.trim() || u.name } : u
    )
    setUsers(updatedUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
  }, [users])

  return {
    users,
    currentUser,
    currentUserId,
    isLoading,
    createUser,
    switchUser,
    deleteUser,
    renameUser,
    hasUsers: users.length > 0
  }
}
