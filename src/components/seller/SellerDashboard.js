import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, Package, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/apiClient';
import { fetchProducts } from '../../api/products';
import { fetchOrders } from '../../api/orders';

const SellerDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [productStats, setProductStats] = useState({ totalProducts: 0, activeProducts: 0, outOfStock: 0 });
  const [orderStats, setOrderStats] = useState({ recentOrders: [], totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    async function loadSellerData() {
      if (!user?.seller?.id) {
        setLoading(false);
        return;
      }

      try {
        const [products, orders] = await Promise.all([
          fetchProducts({ sellerId: user.seller.id, perPage: 100 }),
          fetchOrders({ sellerId: user.seller.id, perPage: 100 }),
        ]);

        setProductStats({
          totalProducts: products.length,
          activeProducts: products.filter((product) => product.stock > 0).length,
          outOfStock: products.filter((product) => product.stock === 0).length,
        });

        setOrderStats({
          recentOrders: orders.slice(0, 4),
          totalOrders: orders.length,
          pendingOrders: orders.filter((order) => order.status !== 'DELIVERED').length,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load seller dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadSellerData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">Loading seller dashboard...</div>
    );
  }

  if (!currentUser || currentUser.role?.toLowerCase() !== 'seller') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Seller access required</h2>
        <p className="text-gray-600 mb-4">Please log in with a seller account to access the dashboard.</p>
        <button
          onClick={() => navigate('/seller-login')}
          className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
        >
          Go to Seller Login
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: productStats.totalProducts, icon: Package, color: 'text-blue-600' },
    { label: 'Active Products', value: productStats.activeProducts, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Orders This Month', value: orderStats.totalOrders, icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Pending Orders', value: orderStats.pendingOrders, icon: AlertCircle, color: 'text-orange-600' },
  ];

  const getStatusBadgeColor = (status) => {
    const colors = {
      PLACED: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PACKED: 'bg-purple-100 text-purple-800',
      TRANSIT: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PLACED: 'New Order',
      CONFIRMED: 'Confirmed',
      PACKED: 'Packed',
      TRANSIT: 'In Transit',
      DELIVERED: 'Delivered',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser.name || currentUser.email}.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/seller/products')}
            className="bg-white border border-gray-300 text-gray-900 px-5 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate('/seller/product/new')}
            className="bg-accent text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-dark"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon size={28} className={`${stat.color} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Profile</h2>
          <p className="text-gray-700 font-semibold">{currentUser.seller?.businessName || 'Business name unavailable'}</p>
          <p className="text-gray-600 mt-2">Owner: {currentUser.name}</p>
          <p className="text-gray-600">Email: {currentUser.email}</p>
          {currentUser.phone && <p className="text-gray-600">Phone: {currentUser.phone}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/seller/orders')}
              className="text-accent font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {orderStats.recentOrders.length === 0 ? (
            <p className="text-gray-600">No recent orders available.</p>
          ) : (
            <div className="space-y-3">
              {orderStats.recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Buyer</p>
                      <p className="font-semibold text-gray-900">{order.buyerName || 'Guest'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-semibold text-accent">MK{Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
