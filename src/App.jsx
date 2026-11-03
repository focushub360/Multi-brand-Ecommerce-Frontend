import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AgriculturePage from './pages/AgriculturePage';
import AgricultureProductDetailPage from './pages/AgricultureProductDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ElectronicsPage from './pages/ElectronicsPage';
import AutomotivePage from './pages/AutomotivePage';
import GroceriesPage from './pages/GroceriesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BecomeDealerPage from './pages/BecomeDealerPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// GROVE Admin Portal Pages & Components
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminDealersPage from './pages/admin/AdminDealersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// GROVE Dealer Portal Pages
import DealerDashboard from './pages/dealer/DealerDashboard';
import DealerProducts from './pages/dealer/DealerProducts';
import AddProduct from './pages/dealer/AddProduct';
import EditProduct from './pages/dealer/EditProduct';
import DealerInventory from './pages/dealer/DealerInventory';
import DealerOrders from './pages/dealer/DealerOrders';
import DealerOrderDetails from './pages/dealer/DealerOrderDetails';
import DealerAnalytics from './pages/dealer/DealerAnalytics';
import DealerStoreSettings from './pages/dealer/DealerStoreSettings';
import DealerHelpSupport from './pages/dealer/DealerHelpSupport';

// GROVE Customer Shopping & Account Pages
import WishlistPage from './pages/customer/WishlistPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import AddressesPage from './pages/customer/AddressesPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Marketplace Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/agriculture" element={<AgriculturePage />} />
        <Route path="/agriculture/product/:productId" element={<AgricultureProductDetailPage />} />
        <Route path="/electronics" element={<ElectronicsPage />} />
        <Route path="/electronics/product/:productId" element={<ProductDetailPage />} />
        <Route path="/automotive" element={<AutomotivePage />} />
        <Route path="/automotive/product/:productId" element={<ProductDetailPage />} />
        <Route path="/groceries" element={<GroceriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/become-a-dealer" element={<BecomeDealerPage />} />

        {/* Fallback Product Detail Route Aliases */}
        <Route path="/product/:productId" element={<AgricultureProductDetailPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />

        {/* Protected Customer Shopping & Account Routes */}
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute allowedRole="customer">
              <WishlistPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute allowedRole="customer">
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute allowedRole="customer">
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-confirmation/:orderId" 
          element={
            <ProtectedRoute allowedRole="customer">
              <OrderConfirmationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={<Navigate to="/account/orders" replace />} 
        />
        <Route 
          path="/account/orders" 
          element={
            <ProtectedRoute allowedRole="customer">
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account/orders/:orderId" 
          element={
            <ProtectedRoute allowedRole="customer">
              <OrderDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account/addresses" 
          element={
            <ProtectedRoute allowedRole="customer">
              <AddressesPage />
            </ProtectedRoute>
          } 
        />

        {/* Dedicated Admin Portal Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected Admin Routes (13 Core Modules) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboardOverview />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dealers" 
          element={
            <AdminProtectedRoute>
              <AdminDealersPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminProtectedRoute>
              <AdminProductsPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/inventory" 
          element={
            <AdminProtectedRoute>
              <AdminInventoryPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminProtectedRoute>
              <AdminUsersPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/locations" 
          element={
            <AdminProtectedRoute>
              <AdminLocationsPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <AdminProtectedRoute>
              <AdminCategoriesPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminProtectedRoute>
              <AdminAnalyticsPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/payments" 
          element={
            <AdminProtectedRoute>
              <AdminPaymentsPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/support" 
          element={
            <AdminProtectedRoute>
              <AdminSupportPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <AdminProtectedRoute>
              <AdminReportsPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminProtectedRoute>
              <AdminSettingsPage />
            </AdminProtectedRoute>
          } 
        />

        {/* Protected Dealer Portal Routes */}
        <Route 
          path="/dealer/dashboard" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/overview" 
          element={<Navigate to="/dealer/dashboard" replace />} 
        />
        <Route 
          path="/dealer/products" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/products/add" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <AddProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/products/edit/:id" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <EditProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/inventory" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerInventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/orders" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/orders/:id" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerOrderDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/analytics" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/store-settings" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerStoreSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dealer/help-support" 
          element={
            <ProtectedRoute allowedRole="dealer">
              <DealerHelpSupport />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
