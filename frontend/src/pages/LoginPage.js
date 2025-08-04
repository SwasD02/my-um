import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import {Route,User,Lock,ArrowRight,Eye,EyeOff,UserCheck,Sparkles} from 'lucide-react';
import UserProfContext from '../context/UserProfContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const { userName, updateUserProf } = useContext(UserProfContext);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Login:', { username, password });
    updateUserProf(username);
    navigate('/userpage');
    
  };

  const handleGuestLogin = () => {
    console.log('Guest login');
    updateUserProf();
    console.log("userNAME: ", userName);
    navigate('/userpage');
    
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Login Container */}
      <div className={`w-full max-w-md transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Routeine</h1>
          <p className="text-slate-400">Your journey to smarter planning starts here</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your username"
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-300 focus:outline-none ${
                    focusedField === 'username' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20 bg-slate-700' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                />
                {focusedField === 'username' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-slate-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your password"
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 transition-all duration-300 focus:outline-none ${
                    focusedField === 'password' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20 bg-slate-700' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {focusedField === 'password' && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!username || !password}
              className={`w-full py-4 rounded-xl font-medium transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                username && password
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Dashboard</span>
              {username && password && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative bg-slate-900 px-4">
                <span className="text-sm text-slate-400">or</span>
              </div>
            </div>

            {/* Guest Login Button */}
            <button
              onClick={handleGuestLogin}
              className="w-full py-4 rounded-xl font-medium bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
            >
              <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200" />
              <span>Continue as Guest</span>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors duration-200" />
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-400">
                New to Routeine? Just enter your details and start planning!
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;