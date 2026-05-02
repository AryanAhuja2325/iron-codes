import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Search, ChevronDown, Code, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const [user, setUser] = useState<any>(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});

useEffect(() => {
  const syncUser = () => {
    const saved = localStorage.getItem('user');
    setUser(saved ? JSON.parse(saved) : null);
  };

  window.addEventListener('storage', syncUser);
  return () => window.removeEventListener('storage', syncUser);
}, []);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Problems', path: '/problems', highlight: true },
    { name: 'Discuss', path: '/discuss' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-12">
          {/* Left Side: Logo & Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-black" />
            </Link>
            
            <div className="hidden md:flex md:space-x-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center text-sm font-normal transition-colors hover:text-black ${
                      isActive ? 'text-black font-medium' : 'text-gray-500'
                    } ${link.highlight ? 'text-orange-500 hover:text-orange-600' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side: Search & Premium */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-10 pr-3 py-1 border-transparent bg-gray-100 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              />
            </div>
            
            {user ? (
  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold cursor-pointer">
    {user.name?.charAt(0).toUpperCase()}
  </div>
) : (
  <Link to="/login" className="text-sm text-gray-500 hover:text-black">
    Sign in
  </Link>
)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;