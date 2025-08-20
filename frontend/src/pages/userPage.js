import { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line
import {Home,BarChart3,MapPin,Calendar,Settings,User,Bell,Menu,X,ChevronRight,Clock,Route,Zap,Target} from 'lucide-react';
import RoutePlan from '../components/RoutePlan';
import TripList from '../components/TripList';
import UserProfContext from '../context/UserProfContext';
import Schedule from '../components/Schedule';
import Locations from '../components/Locations';

const UserPage = () => {
  const { userName, userid } = useContext(UserProfContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('workspace');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if(!userName || !userid) {
      setSidebarOpen(false);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  const sidebarTabs = [
    {
      id: 'workspace',
      name: 'Workspace',
      icon: Home,
      path: '/workspace',
      color: '#F59E0B',
      description: 'Map your day!',
      body: ''
    },
    {
      id: 'routes',
      name: 'Routes',
      icon: Route,
      path: '/routes',
      color: '#E31E31',
      description: 'Plan your journeys',
      body: ''
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: '#6FC965',
      description: 'Performance metrics',
      body: ''
    },
    {
      id: 'locations',
      name: 'Locations',
      icon: MapPin,
      path: '/locations',
      color: '#8B5CF6',
      description: 'Manage your places',
      body: ''
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: Calendar,
      path: '/schedule',
      color: '#06B6D4',
      description: 'Time management',
      body: ''
    },
    {
      id: 'optimize',
      name: 'Optimize',
      icon: Zap,
      path: '/optimize',
      color: '#F97316',
      description: 'Smart suggestions',
      body: ''
    },
    {
      id: 'goals',
      name: 'Goals',
      icon: Target,
      path: '/goals',
      color: '#10B981',
      description: 'Track progress',
      body: ''
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    // In your actual implementation, you'd use navigate(tab.path) here
    console.log(`Navigating to ${tab.path}`);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (

    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      {<div
        className={`${
          sidebarOpen ? "w-80" : "w-20"
        } transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col relative`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                  <Route className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Routeine</h1>
                  <p className="text-xs text-slate-400">Smart Planning</p>
                </div>
              </div>
            )}
            <button
              onClick={userName && userid ? () => setSidebarOpen(!sidebarOpen) : null}
              className={`p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-400 hover:text-white ${
                !userName && !userid && "cursor-not-allowed"
              }`}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 py-6 px-3 space-y-2">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={userName && userid ? () => handleTabClick(tab): null}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-slate-800 shadow-lg transform scale-105"
                    : "hover:bg-slate-800/50 hover:transform hover:scale-102"
                  } ${!userid && !userName && "cursor-not-allowed"}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-0 w-1 h-full rounded-r-full"
                    style={{ backgroundColor: tab.color }}
                  />
                )}

                <div
                  className={`flex items-center p-4 ${
                    sidebarOpen ? "justify-start" : "justify-center"
                  }`}
                >
                  {/* Icon with color animation */}
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                      style={isActive ? { color: tab.color } : {}}
                    />
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                        style={{ backgroundColor: tab.color }}
                      />
                    )}
                  </div>

                  {sidebarOpen && (
                    <div className="ml-4 flex-1 text-left">
                      <div
                        className={`font-medium transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {tab.name}
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-200">
                        {tab.description}
                      </div>
                    </div>
                  )}

                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -skew-x-12 transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
              </button>
            );
          })}
        </div>

        {/* Settings at bottom */}
        <div className="p-3 border-t border-slate-800">
          <button className="w-full flex items-center p-4 rounded-xl hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-white group">
            <Settings className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4 font-medium">Settings</span>}
          </button>
        </div>
      </div>}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white capitalize">
                {activeTab}
              </div>
              <div className="text-slate-400">/</div>
              <div className="text-slate-400">
                {sidebarTabs.find((tab) => tab.id === activeTab)?.description}
              </div>
            </div>


            {/* Right side - Time, Date, and User */}
            <div className="flex items-center space-x-6">
              {/* Date and Time */}
              <div className="text-right">
                <div className="text-white font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-slate-400">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Notifications */}
              {/*<button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-400 hover:text-white">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>*/}

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium group-hover:text-orange-400 transition-colors duration-200">
                      {userName? userName : "Hi guest!"}
                    </div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {<main className="flex-1 overflow-auto bg-slate-950 h-[calc(100vh-64px)]">
          <div className="p-6">
            {/* Sample Dashboard Content */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 min-h-[calc(100vh-150px)]">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  {/*<BarChart3 className="w-8 h-8 mr-3 text-orange-500" />*/}
                  {sidebarTabs.find((tab) => tab.id === activeTab)?.name}
                </h1>
                <p className="text-slate-400">
                  {sidebarTabs.find((tab) => tab.id === activeTab)?.description}
                </p>
                {activeTab === "workspace" && 
                  <div>
                  <RoutePlan/>
                  <TripList/>
                  </div>
                }
                {activeTab === 'schedule' && 
                  <div>
                    <Schedule/>
                  </div>
                }
                {
                  activeTab === 'locations' && <div><Locations/></div>
                }

              </div>
            </div>

                
          </div>
        </main>}
      </div>

      
    </div>
  );
};

export default UserPage;