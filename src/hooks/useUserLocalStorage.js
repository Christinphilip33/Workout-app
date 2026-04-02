import { useState, useEffect, useCallback } from 'react'
import { useUser } from '../context/UserContext.jsx'

/**
 * User-namespaced localStorage hook
 * Automatically prefixes keys with user ID for multi-user support
 */
export function useUserLocalStorage(key, initialValue) {
  const { currentUserId } = useUser()

  // Generate the namespaced key
  const namespacedKey = currentUserId ? `user_${currentUserId}_${key}` : key

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(namespacedKey)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${namespacedKey}":`, error)
      return initialValue
    }
  })

  // Update stored value when user changes
  useEffect(() => {
    if (!currentUserId) return

    try {
      const item = window.localStorage.getItem(namespacedKey)
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.warn(`Error reading localStorage key "${namespacedKey}":`, error)
      setStoredValue(initialValue)
    }
  }, [currentUserId, namespacedKey, initialValue])

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(namespacedKey, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${namespacedKey}":`, error)
    }
  }, [namespacedKey, storedValue])

  return [storedValue, setValue]
}
