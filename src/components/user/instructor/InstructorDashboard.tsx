import React, { useState } from 'react';
import { 
  Home,
  BookOpenCheck,
  GraduationCap,
  MessageCircle,
  Calendar,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Bell
} from 'lucide-react';
import logo from '../../../assets/home/logo.png'

const InstructorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BookOpenCheck, label: 'My Courses' },
    { icon: GraduationCap, label: 'Students' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: Calendar, label: 'Schedule' },
    { icon: TrendingUp, label: 'Analytics' },
  ];

  const bottomNavItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help Center' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-900 text-white h-screen p-5 pt-8 fixed lg:relative transition-all duration-300`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
          <img src={logo} alt="EduWorld Logo" className="h-10 w-10" />
          </div>
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-yellow-400">EduWorld</h2>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 text-yellow-400 focus:outline-none"
        >
          <Menu size={24} />
        </button>

        <nav className="space-y-4">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-blue-800 text-yellow-400' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? 'text-yellow-400' : ''}`} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {bottomNavItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:text-yellow-400 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-blue-900 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Simplified Dashboard Content */}
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Welcome to Instructor Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;