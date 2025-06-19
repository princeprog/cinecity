import React, { useState } from 'react';
import { Eye, EyeOff, Film, Lock, Mail, Popcorn, ChevronRight, Star, Calendar } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login/signup process
    setTimeout(() => {
      setIsLoading(false);
      console.log(isSignUp ? 'Sign up attempt:' : 'Login attempt:', formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark theme background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Header - Update branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-6 shadow-2xl">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            CineCity
          </h1>
          <p className="text-gray-400 text-lg">Your Premium Cinema Experience</p>
          <p className="text-gray-500 text-sm mt-2">Book • Watch • Enjoy</p>
        </div>

        {/* Form container - Update styling */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          {/* Toggle buttons */}
          <div className="flex mb-8 bg-gray-900/50 rounded-xl p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isSignUp
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div>
            {/* Full Name Input (only for signup) */}
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    👤
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox (only for signup) */}
            {isSignUp && (
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-gray-400 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-red-400 hover:text-red-300 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-red-400 hover:text-red-300 underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            )}

            {/* Remember Me & Forgot Password (only for login) */}
            {!isSignUp && (
              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {isSignUp ? '🎬 Create Account' : '🍿 Start Booking'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>

            {/* Social Login Options */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/40 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-300">
                <span className="mr-2">🔍</span>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-300">
                <span className="mr-2">📘</span>
                Facebook
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                {isSignUp ? 'Sign in here' : 'Sign up here'}
              </button>
            </p>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
            <div className="text-2xl mb-2">🎟️</div>
            <p className="text-gray-300 text-sm font-medium">Easy Booking</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
            <div className="text-2xl mb-2">💺</div>
            <p className="text-gray-300 text-sm font-medium">Seat Selection</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
            <div className="text-2xl mb-2">🎁</div>
            <p className="text-gray-300 text-sm font-medium">Rewards</p>
          </div>
        </div>

        {/* Update footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          © 2025 CineCity. All rights reserved. | Your premium cinema destination
        </p>
      </div>
    </div>
  );
}