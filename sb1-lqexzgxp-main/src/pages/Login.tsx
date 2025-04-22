import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !userLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowForgotPassword(false);

    try {
      console.log('Attempting to sign in...');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setLoading(false);
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('invalid_credentials')) {
          setError('The email or password you entered is incorrect');
          setShowForgotPassword(true);
        } else {
          setError(signInError.message || 'An error occurred during sign in');
        }
        return;
      }
      
      if (data?.session) {
        console.log('Sign in successful, session created');
        // Wait a moment for the session to be properly set
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        console.error('No session data returned');
        setError('Failed to sign in. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setShowForgotPassword(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setError('Password reset instructions have been sent to your email');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-blue-100 text-lg max-w-md">
            Access your dashboard and manage your content with our powerful tools.
          </p>
        </div>
        <div className="text-blue-100 text-sm">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-700 text-sm">{error}</p>
                  {showForgotPassword && (
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-red-600 hover:text-red-500 text-sm font-medium mt-1"
                    >
                      Reset your password
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 