import React, { useEffect, useState } from 'react';
import { fetchAdminReports } from '../../api/admin';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAdminReports();
        setData(response);
      } catch (err) {
        console.error('Failed to load admin reports', err);
        setError('Could not load reports');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Admin Reports</h1>
        <p className="text-gray-600 mt-1">Platform insights and recent order activity.</p>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded-lg shadow-md text-gray-600">Loading reports...</div>
      ) : error ? (
        <div className="p-6 bg-white rounded-lg shadow-md text-red-600">{error}</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Users</p>
              <p className="mt-3 text-3xl font-bold text-secondary">{data.summary.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Sellers</p>
              <p className="mt-3 text-3xl font-bold text-secondary">{data.summary.totalSellers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Orders</p>
              <p className="mt-3 text-3xl font-bold text-secondary">{data.summary.totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p className="mt-3 text-3xl font-bold text-secondary">MK {Number(data.summary.totalRevenue).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-secondary mb-4">Order Status Breakdown</h2>
              <div className="space-y-2">
                {data.orderStatusBreakdown.map((item) => (
                  <div key={item.status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.status}</span>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-secondary mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p className="font-semibold text-gray-900">Order {order.id}</p>
                      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm text-gray-700">
                      <div>
                        <p className="font-semibold">Buyer</p>
                        <p>{order.buyerName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Seller</p>
                        <p>{order.sellerName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Amount</p>
                        <p>MK {order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">Status: {order.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Reports;
