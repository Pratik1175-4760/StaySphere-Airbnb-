import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f7] border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <i className="fa-regular fa-compass text-2xl text-[#FF385C]"></i>
              <span className="text-[#FF385C] font-bold text-xl tracking-tight">
                StaySphere
              </span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your favorite home away from home.
            </p>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:underline cursor-pointer">Help Center</li>
              <li className="hover:underline cursor-pointer">Safety information</li>
              <li className="hover:underline cursor-pointer">Cancellation options</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase">Hosting</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/new" className="hover:underline">Add your home</Link></li>
              <li className="hover:underline cursor-pointer">Hosting resources</li>
              <li className="hover:underline cursor-pointer">Community forum</li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase">Social</h4>
            <div className="flex space-x-4 text-2xl text-gray-700">
              <i className="fa-brands fa-square-facebook hover:text-[#FF385C] cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-square-twitter hover:text-[#FF385C] cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-square-instagram hover:text-[#FF385C] cursor-pointer transition-colors"></i>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <span>© 2026 StaySphere, Inc.</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
          <div className="flex items-center space-x-4 font-semibold text-gray-900">
            <span className="hover:underline cursor-pointer flex items-center">
              <i className="fa-solid fa-globe mr-2"></i> English (US)
            </span>
            <span className="hover:underline cursor-pointer">$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}