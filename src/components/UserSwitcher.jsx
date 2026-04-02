import { useState } from 'react'
import { useUser } from '../context/UserContext.jsx'

export default function UserSwitcher() {
  const { users, currentUser, switchUser, createUser, deleteUser, renameUser } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleCreateUser = () => {
    if (newUserName.trim()) {
      createUser(newUserName.trim())
      setNewUserName('')
      setShowNewUserForm(false)
      setIsOpen(false)
    }
  }

  const handleRename = (userId) => {
    if (editName.trim()) {
      renameUser(userId, editName.trim())
      setEditingUserId(null)
      setEditName('')
    }
  }

  const handleDelete = (userId) => {
    if (window.confirm('Delete this profile and all their workout data?')) {
      deleteUser(userId)
    }
  }

  if (!currentUser) return null

  return (
    <div className="relative">
      {/* Current user button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-xl hover:bg-gray-700/60 transition-all"
      >
        <div className="w-7 h-7 bg-primary-500/20 border border-primary-500/40 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary-400">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">
          {currentUser.name}
        </span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Switch Profile</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="relative group">
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-2 p-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(user.id)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(user.id)}
                        className="text-primary-400 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="text-gray-500 text-sm"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        switchUser(user.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-800/60 transition-colors ${
                        user.id === currentUser.id ? 'bg-gray-800/40' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.id === currentUser.id
                          ? 'bg-primary-500/30 border border-primary-500/50'
                          : 'bg-gray-700 border border-gray-600'
                      }`}>
                        <span className={`text-sm font-bold ${
                          user.id === currentUser.id ? 'text-primary-400' : 'text-gray-400'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        user.id === currentUser.id ? 'text-white' : 'text-gray-300'
                      }`}>
                        {user.name}
                      </span>
                      {user.id === currentUser.id && (
                        <span className="ml-auto text-xs text-primary-400">Active</span>
                      )}
                    </button>
                  )}

                  {/* Edit/Delete buttons (show on hover) */}
                  {editingUserId !== user.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingUserId(user.id)
                          setEditName(user.name)
                        }}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors"
                        title="Rename"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {users.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(user.id)
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new user */}
            <div className="p-3 border-t border-gray-800">
              {showNewUserForm ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateUser}
                    disabled={!newUserName.trim()}
                    className="px-3 py-2 bg-primary-500 text-gray-900 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowNewUserForm(false)
                      setNewUserName('')
                    }}
                    className="px-2 py-2 text-gray-500 hover:text-white"
                  >
                    X
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Profile
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
