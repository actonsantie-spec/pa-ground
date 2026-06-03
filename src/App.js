import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Profile from "./components/Profile";
import SellerGuidelines from "./components/SellerGuidelines";



// Shared Components
import Header from './components/Header';
import Footer from './components/footer';
import BuyerLogin from './components/BuyerLogin';
import SellerLogin from './components/SellerLogin';
import Support from './components/Support';
import Browse from './components/Browse';

// Buyer Components
import ProductDetails from './components/buyer/ProductDetails';
import Cart from './components/buyer/Cart';
import Checkout from './components/buyer/Checkout';
import OrderTracking from './components/buyer/OrderTracking';
import SellerDirectory from './components/buyer/SellerDirectory';
import BuyerProfile from './components/buyer/BuyerProfile';
import BuyerDashboard from './components/buyer/BuyerDashboard';

// Seller Components
import SellerProfile from './components/seller/SellerProfile';
import SellerDashboard from './components/seller/SellerDashboard';
import ProductForm from './components/seller/ProductForm';
import ProductList from './components/seller/ProductList';
import SellerOrderManagement from './components/seller/OrderManagement';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import SellerApproval from './components/admin/SellerApproval';
import CategoryManagement from './components/admin/CategoryManagement';
import ListingModeration from './components/admin/ListingModeration';
import Statistics from './components/admin/Statistics';
import PaymentMethodsAdmin from './components/admin/PaymentMethodsAdmin';
import UserManagement from './components/admin/UserManagement';
import OrderManagement from './components/admin/OrderManagement';
import Reports from './components/admin/Reports';

// Home Page Component
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Header />
    
    {/* Hero Section */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Malawi Business Connector" className="h-32 w-32 object-contain" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Malawi Business Connector
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with businesses and customers across Malawi. Buy, sell, and grow your business with trust.
        </p>
        <div className="flex gap-4 justify-center pt-4 flex-wrap">
          <a href="/buyer-login" className="bg-accent hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Buy Now
          </a>
          <a href="/seller-login" className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Become a Seller
          </a>
          <a href="/search" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Browse Products
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow">
          <p className="text-4xl mb-4">🛍️</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Products</h3>
          <p className="text-gray-600">Find products from trusted sellers across all categories. Login as a buyer to shop.</p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow">
          <p className="text-4xl mb-4">🏪</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sell Easily</h3>
          <p className="text-gray-600">List your products and reach thousands of customers in minutes. Register as a seller.</p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow">
          <p className="text-4xl mb-4">📍</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Local Delivery</h3>
          <p className="text-gray-600">Track orders and arrange delivery across all 10 districts in Malawi</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        <div className="bg-accent rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Shopping Today</h2>
          <p className="mb-6">Create a buyer account and discover products from verified sellers across Malawi.</p>
          <a href="/buyer-signup" className="inline-block bg-white text-accent font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Create Buyer Account
          </a>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Your Store</h2>
          <p className="mb-6">Open a seller account and start selling to thousands of customers in Malawi today.</p>
          <a href="/seller-signup" className="inline-block bg-accent text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Create Seller Account
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

const AdminRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const BuyerRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user || user.role !== 'BUYER') {
    return <Navigate to="/buyer-login" replace />;
  }
  return children;
};

const SellerRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user || user.role !== 'SELLER') {
    return <Navigate to="/seller-login" replace />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Buyer Authentication Routes */}
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-signup" element={<BuyerLogin isSignup={true} />} />

          {/* Seller Authentication Routes */}
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-signup" element={<SellerLogin isSignup={true} />} />

          {/* Support Route */}
          <Route path="/support" element={
            <>
              <Header />
              <Support />
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />


          {/* Buyer Routes */}
          <Route path="/search" element={
            <>
              <Header />
              <Browse />
              <Footer />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Header />
              <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                  <ProductDetails />
                </div>
              </div>
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <BuyerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                    <Cart />
                  </div>
                </div>
                <Footer />
              </>
            </BuyerRoute>
          } />
          <Route path="/checkout" element={
            <BuyerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                    <Checkout />
                  </div>
                </div>
                <Footer />
              </>
            </BuyerRoute>
          } />
          <Route path="/orders" element={
            <BuyerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <OrderTracking />
                  </div>
                </div>
                <Footer />
              </>
            </BuyerRoute>
          } />
          <Route path="/sellers" element={
            <>
              <Header />
              <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                  <SellerDirectory />
                </div>
              </div>
              <Footer />
            </>
          } />
          <Route path="/buyer-profile" element={
            <BuyerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-3xl mx-auto px-4">
                    <BuyerProfile />
                  </div>
                </div>
                <Footer />
              </>
            </BuyerRoute>
          } />
          <Route path="/buyer-dashboard" element={
            <BuyerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <BuyerDashboard />
                  </div>
                </div>
                <Footer />
              </>
            </BuyerRoute>
          } />
          <Route path="/seller-guidelines" element={<SellerGuidelines />} />


          {/* Seller Routes */}
          <Route path="/seller-signup" element={
            <>
              <Header />
              <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                  <SellerLogin isSignup={true} />
                </div>
              </div>
              <Footer />
            </>
          } />
          <Route path="/seller-dashboard" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <SellerDashboard />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />
          <Route path="/seller/profile" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-3xl mx-auto px-4">
                    <SellerProfile />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />
          <Route path="/seller/products" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <ProductList />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />
          <Route path="/seller/product/new" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-3xl mx-auto px-4">
                    <ProductForm />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />
          <Route path="/seller/product/edit/:id" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-3xl mx-auto px-4">
                    <ProductForm />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />
          <Route path="/seller/orders" element={
            <SellerRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <SellerOrderManagement />
                  </div>
                </div>
                <Footer />
              </>
            </SellerRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <AdminDashboard />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/sellers" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <SellerApproval />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <UserManagement />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <OrderManagement />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <Reports />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <CategoryManagement />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/payment-methods" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <PaymentMethodsAdmin />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/listings" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <ListingModeration />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
          <Route path="/admin/statistics" element={
            <AdminRoute>
              <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <Statistics />
                  </div>
                </div>
                <Footer />
              </>
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
    </AppProvider>
  );
}

export default App;
