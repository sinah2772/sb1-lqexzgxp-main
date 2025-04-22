import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Analytics from './pages/Analytics';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';
import Comments from './pages/Comments';
import Audience from './pages/Audience';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import BusinessDashboard from './pages/BusinessDashboard';
import { useUser } from './hooks/useUser';
import Home from './pages/Home';
import Article from './pages/Article';
import Category from './pages/Category';
import Subcategory from './pages/Subcategory';
import Search from './pages/Search';
import { testSupabaseConnection } from './lib/supabase-test';
import Login from './pages/Login';

function App() {
  const { user, loading } = useUser();

  // Test Supabase connection on app load
  useEffect(() => {
    testSupabaseConnection().then(result => {
      console.log('Supabase connection test completed:', result);
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<Article />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="category/:categorySlug/:subcategorySlug" element={<Subcategory />} />
          <Route path="search" element={<Search />} />
        </Route>
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Dashboard routes */}
        <Route 
          path="/dashboard" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/articles" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Articles />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/analytics" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Analytics />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/new-article" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <NewArticle />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/edit-article/:id" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <EditArticle />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/comments" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Comments />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/audience" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Audience />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/settings" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Settings />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/profile" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard/business" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : user ? (
              <BusinessDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;