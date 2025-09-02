import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';
import { FiLoader } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }

  if (user.accountType === 'freelancer') {
    return <SellerDashboard />;
  } else if (user.accountType === 'buyer') {
    return <BuyerDashboard />;
  } else {
    console.warn("المستخدم ليس له نوع حساب، يتم توجيهه إلى /account-type");
    navigate('/account-type');
    return null;
  }
};

export default Dashboard;
