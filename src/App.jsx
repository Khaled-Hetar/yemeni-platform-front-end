import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// --- المكونات الأساسية ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './pages/ProtectedRoute'; // <-- المكون الحارس

// --- الصفحات العامة (يمكن لأي شخص الوصول إليها) ---
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ServicesPage from './pages/ServicesPage';
import ServiceDetails from "./pages/ServiceDetails";

import Projects from './pages/Projects'; // صفحة عرض المشاريع العامة
import ProjectDetailsPage from './pages/ProjectDetailsPage'; // تفاصيل مشروع عام
import UserProfile from './pages/UserProfile'; // صفحة الملف الشخصي عامة
import ContactUs from './pages/ConcateUs';
import AboutUs from './pages/AboutUs';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import TermsofService from './pages/TermsofService';

// --- الصفحات المحمية (تتطلب تسجيل الدخول) ---
import Dashboard from './pages/Dashboard'; // الموجه الذكي
import AccountTypePage from './pages/AccountTypePage';
import EmailVerification from './pages/EmailVerification';
import EditUserProfile from './pages/EditUserProfile';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import ConversationsPage from './api/ConversationsPage';
import Chat from './pages/chat';

// --- صفحات محمية (خاصة بالبائع - Freelancer) ---
import AddService from './pages/AddService';
import OrdersManagement from './pages/OrdersManagement';
import ServiceManagement from './pages/ServiceManagement';

// --- صفحات محمية (خاصة بالمشتري - Buyer) ---
import NewProjectPage from './pages/NewProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import SubmitProposalPage from './pages/SubmitProposalPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import Checkout from './pages/Checkout';

import NotFoundPage from './pages/NotFoundPage';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* ===================   1. المسارات العامة   ===================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* صفحات التصفح العامة */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />

            {/* صفحات المعلومات العامة */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/termsandprivacy" element={<TermsAndPrivacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/termsof-service" element={<TermsofService />} />

            {/* ===================   2. المسارات المحمية   ==================== */}
            <Route element={<ProtectedRoute />}>
              {/* مسارات مشتركة بين كل المستخدمين المسجلين */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account-type" element={<AccountTypePage />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/edit-profile" element={<EditUserProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/conversations" element={<ConversationsPage />} />
              <Route path="/chat/:conversationId" element={<Chat />} />

              {/* مسارات خاصة بالبائع (Freelancer) */}
              <Route path="/add-service" element={<AddService />} />
              <Route path="/orders-management" element={<OrdersManagement />} />
              <Route path="/service-management" element={<ServiceManagement />} />

              {/* مسارات خاصة بالمشتري (Buyer) وصاحب المشروع */}
              <Route path="/projects/new" element={<NewProjectPage />} />
              <Route path="/projects/edit/:id" element={<EditProjectPage />} />
              <Route path="/project-management" element={<ProjectManagementPage />} />
              <Route path="/submit-proposal/:projectId" element={<SubmitProposalPage />} />
              <Route path="/projects/:projectId/review" element={<SubmitReviewPage />} />
              <Route path="/checkout/:serviceId" element={<Checkout />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
