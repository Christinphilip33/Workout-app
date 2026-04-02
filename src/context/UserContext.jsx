import { createContext, useContext } from 'react'
import { useUserProfile } from '../hooks/useUserProfile.js'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const userProfile = useUserProfile()

  // Show loading state while checking for users
  if (userProfile.isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={userProfile}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
