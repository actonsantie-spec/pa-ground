import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';
import { fetchAdminStats } from '../../api/admin';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingSellers: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchAdminStats();
                if (response.stats) setStats(response.stats);
            } catch (err) {
                console.error('Failed to load admin dashboard stats', err);
                setError('Unable to load dashboard metrics');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600' },
        { label: 'Active Sellers', value: stats.totalSellers.toLocaleString(), icon: ShoppingCart, color: 'text-green-600' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: TrendingUp, color: 'text-purple-600' },
        { label: 'Platform Revenue', value: `MK ${Number(stats.totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-yellow-600' },
        { label: 'Pending Seller Approvals', value: stats.pendingSellers.toLocaleString(), icon: AlertTriangle, color: 'text-red-600' },
    ];

    const recentActivities = [
        { type: 'seller_signup', message: 'New seller registered: Tech Hub Malawi', time: '2 hours ago' },
        { type: 'listing_reported', message: 'Suspicious listing reported: iPhone 12', time: '3 hours ago' },
        { type: 'order_placed', message: '156 new orders placed today', time: '5 hours ago' },
        { type: 'seller_suspended', message: 'Seller suspended for policy violation', time: '1 day ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <img src="/logo.png" alt="Malawi Business Connector" className="h-14 w-14 object-contain" />
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-semibold">{stat.label}</p>
                                    <p className="text-2xl font-bold text-secondary mt-2">{loading ? 'Loading...' : stat.value}</p>
                                </div>
                                <Icon size={28} className={`${stat.color} opacity-20`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-secondary">Recent Activities</h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold text-secondary">{activity.message}</p>
                                        <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                                    </div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                        activity.type === 'seller_suspended'
                                            ? 'bg-accent'
                                            : activity.type === 'listing_reported'
                                            ? 'bg-accent'
                                            : 'bg-primary'
                                    }`}>
                                        {activity.type.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        <h3 className="text-lg font-bold text-secondary">Quick Actions</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Review Sellers', href: '/admin/sellers', color: 'bg-accent text-white' },
                                { label: 'Manage Users', href: '/admin/users', color: 'bg-primary text-white' },
                                { label: 'Manage Orders', href: '/admin/orders', color: 'bg-accent text-white' },
                                { label: 'View Reports', href: '/admin/reports', color: 'bg-primary text-white' },
                            ].map((action, idx) => (
                                <a
                                    key={idx}
                                    href={action.href}
                                    className={`block p-3 rounded-lg ${action.color} hover:opacity-80 transition-opacity font-semibold text-sm`}
                                >
                                    {action.label} →
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>Tip:</strong> Review pending seller applications to maintain platform quality.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
