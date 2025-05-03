
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contacts from '@/pages/Contacts';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import AdminCategories from '@/pages/AdminCategories';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminReviews from '@/pages/AdminReviews';
import AdminAnalytics from '@/pages/AdminAnalytics';
import Profile from '@/pages/Profile';
import AdminTasks from '@/pages/AdminTasks';
import AdminReports from '@/pages/AdminReports';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Административная панель */}
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/tasks" element={<AdminTasks />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        
        {/* 404 - страница не найдена */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
