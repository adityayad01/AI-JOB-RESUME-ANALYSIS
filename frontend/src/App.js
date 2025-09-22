import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

// Item Components
import UploadResume from './components/items/UploadResume';
import Jobs from './components/items/Jobs';
import MockInterviewBot from "./components/items/MockInterviewBot"; // adjust path if different

// Claim Components
import Claims from './components/claims/Claims';

import ClaimDetail from './components/claims/ClaimDetail';

// Notification Components
import Notifications from './components/notifications/Notifications';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import ItemManagement from './components/admin/ItemManagement';
import ClaimManagement from './components/admin/ClaimManagement';

// Context
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 py-4">
            <div className="container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Private Routes */}
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/upload/resume" element={<PrivateRoute><UploadResume /></PrivateRoute>} />
                <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
                <Route path="/mock-interview" element={<PrivateRoute><MockInterviewBot /> </PrivateRoute>} />
                
                <Route path="/claims" element={<PrivateRoute><Claims /></PrivateRoute>} />                <Route path="/claims/:id" element={<PrivateRoute><ClaimDetail /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
 
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/items" element={<AdminRoute><ItemManagement /></AdminRoute>} />
                <Route path="/admin/claims" element={<AdminRoute><ClaimManagement /></AdminRoute>} />
              </Routes>
            </div>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
