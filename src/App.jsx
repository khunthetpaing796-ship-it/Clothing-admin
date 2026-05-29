import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import UploadPage from './pages/UploadPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import Alert from './components/Alert';

function App() {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  return (
    <>
      {alert.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
        </div>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout showAlert={showAlert} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage showAlert={showAlert} />} />
          <Route path="products" element={<ProductsPage showAlert={showAlert} />} />
          <Route path="upload" element={<UploadPage showAlert={showAlert} />} />
          <Route path="upload/:id" element={<UploadPage showAlert={showAlert} />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;