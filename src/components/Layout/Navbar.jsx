import { NavLink } from 'react-router-dom'
import SyncIndicator from '../SyncIndicator.jsx'
import UserSwitcher from '../UserSwitcher.jsx'

const links = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/exercises',
    label: 'Exercises',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
        <path d="M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3" />
        <rect x="6.5" y="4" width="4" height="16" rx="1" />
        <rect x="13.5" y="4" width="4" height="16" rx="1" />
        <path d="M10.5 12h3" />
      </svg>
    ),
  },
  {
    to: '/sessions',
    label: 'Sessions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export default function Navbar() {
  return (
    <>
      {/* ── Desktop Top Nav ── */}
      <nav className="glass-panel sticky top-0 z-50 border-b-0 border-t-0 border-l-0 border-r-0 border-b-gray-800/80 hidden md:block" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4 flex justify-between h-16 items-center">
          <span className="font-extrabold text-xl tracking-tight text-gradient flex items-center gap-2" aria-label="Lift to Sweat home">
            <span aria-hidden="true">🏋️</span> Lift to Sweat
          </span>
          <div className="flex items-center gap-3">
            <SyncIndicator />
            <UserSwitcher />
          </div>
          <div className="flex items-center gap-2" role="navigation">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 shadow-[0_0_15px_rgba(74,222,128,0.15)] glow-effect'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Mobile Top Bar (brand only) ── */}
      <div className="glass-panel sticky top-0 z-50 md:hidden border-b border-gray-800/60">
        <div className="flex justify-between items-center h-14 px-4">
          <span className="font-extrabold text-lg tracking-tight text-gradient flex items-center gap-2" aria-label="Lift to Sweat home">
            <span aria-hidden="true">🏋️</span> Lift to Sweat
          </span>
          <div className="flex items-center gap-2">
            <SyncIndicator />
            <UserSwitcher />
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-gray-800/60 border-b-0 border-l-0 border-r-0"
        aria-label="Main navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-gray-500 active:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {icon}
                  </div>
                  <span className={`text-[10px] font-semibold leading-none transition-colors duration-300 ${isActive ? 'text-primary-400' : ''}`}>
                    {label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
