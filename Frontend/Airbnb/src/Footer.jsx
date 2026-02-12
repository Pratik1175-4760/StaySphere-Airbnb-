import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Safety information
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Cancellation options
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Our COVID-19 Response
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  StaySphere.org: disaster relief housing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Support Afghan refugees
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Combating discrimination
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/new" className="text-sm text-gray-600 hover:underline">
                  Try hosting
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Explore hosting resources
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Visit our community forum
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  How to host responsibly
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">StaySphere</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Learn about new features
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:underline">
                  Investors
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Left Side - Copyright and Links */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-600">
              <span>© 2025 StaySphere, Inc.</span>
              <span className="hidden md:inline">·</span>
              <Link to="#" className="hover:underline">Privacy</Link>
              <span className="hidden md:inline">·</span>
              <Link to="#" className="hover:underline">Terms</Link>
              <span className="hidden md:inline">·</span>
              <Link to="#" className="hover:underline">Sitemap</Link>
              <span className="hidden md:inline">·</span>
              <Link to="#" className="hover:underline">Company details</Link>
            </div>

            {/* Right Side - Language, Currency, and Social */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <button className="flex items-center space-x-2 text-sm font-medium text-white hover:underline">
                <i className="fa-solid fa-globe"></i>
                <span>English (IN)</span>
              </button>

              {/* Currency Selector */}
              <button className="flex items-center space-x-2 text-sm font-medium text-white hover:underline">
                <span>₹</span>
                <span>INR</span>
              </button>

              {/* Social Icons */}
              <div className="flex items-center space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600"
                >
                  <i className="fa-brands fa-facebook-f text-lg"></i>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600"
                >
                  <i className="fa-brands fa-twitter text-lg"></i>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600"
                >
                  <i className="fa-brands fa-instagram text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}