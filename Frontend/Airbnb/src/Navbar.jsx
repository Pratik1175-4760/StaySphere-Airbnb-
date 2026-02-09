import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <i className="fa-regular fa-compass text-3xl text-rose-500"></i>
            <span className="text-rose-500 font-bold text-xl hidden sm:block">
              StaySphere
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`
                text-sm font-medium pb-1 border-b-2 transition-colors
                ${isActive('/') 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-500 border-transparent hover:text-gray-900'
                }
              `}
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              All Listings
            </Link>
            <Link
              to="/new"
              className={`
                text-sm font-medium pb-1 border-b-2 transition-colors
                ${isActive('/new') 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-500 border-transparent hover:text-gray-900'
                }
              `}
            >
              Add new Listing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}