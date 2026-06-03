import React, { useEffect, useState } from 'react';
import { Package, Check, Clock, MapPin, MessageSquare } from 'lucide-react';
import SmartTracker from '../SmartTracker';
import { fetchOrders, updateOrderStatus } from '../../api/orders';
import { getCurrentUser } from '../../api/apiClient';

const SellerOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();
  const sellerId = currentUser?.seller?.id;

  useEffect(() => {
    if (!sellerId) return;

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders({ sellerId, perPage: 100 });
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [sellerId]);

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.notes) parts.push(address.notes);
    return parts.join(', ');
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PLACED: 'bg-gray-200 text-gray-800',
      CONFIRMED: 'bg-blue-200 text-blue-800',
      PACKED: 'bg-purple-200 text-purple-800',
      TRANSIT: 'bg-yellow-200 text-yellow-800',
      DELIVERED: 'bg-green-600 text-white',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: updated.status } : order)));
      if (selectedOrder === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      console.error(err);
      window.alert(err.message || 'Unable to update order status');
    }
  };

  const activeOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  if (!sellerId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <p className="text-lg font-semibold">Seller profile is not available.</p>
        <p className="text-sm text-gray-600">Please log in with a seller account to view orders.</p>
      </div>
    );
  }

  const selected = selectedOrder ? orders.find((order) => order.id === selectedOrder) : null;

  if (selected) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-accent hover:underline font-semibold"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600 font-mono mt-1">{selected.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusBadgeColor(selected.status)}`}>
              {getStatusLabel(selected.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-900">{new Date(selected.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Buyer</p>
              <p className="font-semibold text-gray-900">{selected.buyerName || 'Guest'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-accent text-lg">MK{Number(selected.totalAmount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <a href={`tel:${selected.buyerPhone}`} className="font-semibold text-blue-600 hover:underline">
                {selected.buyerPhone || 'N/A'}
              </a>
            </div>
          </div>
        </div>

        <SmartTracker
          orderId={selected.id}
          initialStatus={selected.status}
          initialLocation={formatAddress(selected.deliveryAddress)}
        />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Items in Order</h3>
          <div className="space-y-3">
            {selected.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">{item.product?.title || item.name || 'Item'}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">MK{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Delivery Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Delivery Address</p>
              <p className="font-semibold text-gray-900">{formatAddress(selected.deliveryAddress)}</p>
            </div>
          </div>
        </div>

        {selected.status !== 'DELIVERED' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-blue-900">Update Order Status</h3>
            <div className="flex gap-2 flex-wrap">
              {['CONFIRMED', 'PACKED', 'TRANSIT', 'DELIVERED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(selected.id, status)}
                  disabled={selected.status === status}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selected.status === status
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <p className="font-semibold text-green-900">Contact Buyer</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <MessageSquare size={18} />
            Send WhatsApp Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">Track and manage all your orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package },
          { label: 'New Orders', value: orders.filter((o) => o.status === 'PLACED').length, icon: Clock },
          { label: 'In Transit', value: orders.filter((o) => o.status === 'TRANSIT').length, icon: MapPin },
          { label: 'Completed', value: orders.filter((o) => o.status === 'DELIVERED').length, icon: Check },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 text-center">
              <Icon size={24} className="mx-auto text-accent mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'PLACED', 'CONFIRMED', 'PACKED', 'TRANSIT', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === status
                  ? 'bg-accent text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">Loading orders...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">{error}</div>
      ) : activeOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Buyer</p>
                  <p className="font-semibold text-gray-900">{order.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-accent">MK{Number(order.totalAmount).toLocaleString()}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(order.id)}
                  className="bg-accent hover:bg-accent-dark text-white rounded-lg px-4 py-2 font-semibold transition-colors"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrderManagement;
