import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, X, User } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Mock notifications data
  const notifications = [
    {
      id: '1',
      message: 'Your article "The Future of AI" has been published',
      time: '2 hours ago',
      read: false,
      link: '#'
    },
    {
      id: '2',
      message: 'New comment on your article',
      time: '5 hours ago',
      read: true,
      link: '#'
    },
    {
      id: '3',
      message: 'Your article has reached 1,000 views!',
      time: 'Yesterday',
      read: false,
      link: '#'
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative ml-4 lg:ml-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1 translate-x-1">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;