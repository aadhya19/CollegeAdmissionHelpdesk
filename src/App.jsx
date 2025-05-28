import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import PostQueryPage from './pages/PostQueryPage';
import TrackQueryPage from './pages/TrackQueryPage';
import PublicQueryPage from './pages/PublicQueryPage';
import ContactPage from './pages/ContactPage';
import FAQ from './pages/FAQ';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFAQManagement from './pages/admin/FAQManagement';
import AdminAnnouncementManagement from './pages/admin/AnnouncementManagement';
import AdminQueryDetail from './pages/admin/QueryDetail';
import AdminPublicQueryForm from './pages/admin/PublicQueryForm';
import AdminAnnouncementForm from './pages/admin/AnnouncementForm';
import PublicQueryManagement from './pages/admin/PublicQueryManagement';
import FAQForm from './pages/admin/FAQForm';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Layout with Sidebar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-query" element={<PostQueryPage />} />
          <Route path="/track-query" element={<TrackQueryPage />} />
          <Route path="/public-queries" element={<PublicQueryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* Admin Login Page — outside layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Layout */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="faqs" element={<AdminFAQManagement />} />
          <Route path="faqs/new" element={<FAQForm />} />
          <Route path="faqs/:id" element={<FAQForm />} />

          <Route path="announcements" element={<AdminAnnouncementManagement />} />
          <Route path="announcements/new" element={<AdminAnnouncementForm />} />
          <Route path="announcements/:id" element={<AdminAnnouncementForm />} />

          <Route path="public-queries" element={<PublicQueryManagement />} />
          <Route path="queries/:id/public" element={<AdminPublicQueryForm />}
           />
          <Route path="queries" element={<PublicQueryManagement />} />
          <Route path="queries/:id" element={<AdminQueryDetail />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
