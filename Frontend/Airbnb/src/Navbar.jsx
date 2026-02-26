import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      setShowDropdown(false);
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <i className="fa-regular fa-compass text-3xl text-rose-500"></i>
            <span className="text-rose-500 font-bold text-xl">
              StaySphere
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                isActive('/') 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-500 border-transparent hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-sm font-medium pb-1 border-b-2  text-gray-500 hover:text-gray-900 transition-colors"
            >
              All Listings
            </Link>
            {user && (
              <Link
                to="/new"
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  isActive('/new') 
                    ? 'text-gray-900 border-gray-900' 
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                Add new Listing
              </Link>
            )}
          </div>

          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Logged In - Dropdown Menu
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-all"
                >
                  <i className="fa-solid fa-bars text-gray-700"></i>
                  <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fa-solid fa-user text-sm"></i>
                  </div>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/new"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa-solid fa-plus text-gray-700"></i>
                        <span className="text-sm text-gray-700">Create Listing</span>
                      </Link>

                      <Link
                        to="/"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa-solid fa-heart text-gray-700"></i>
                        <span className="text-sm text-gray-700">My Favorites</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <i className="fa-solid fa-right-from-bracket text-rose-600"></i>
                          <span className="text-sm text-rose-600 font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Logged Out State
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-rose-500 text-white font-medium rounded-full hover:bg-rose-600 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}