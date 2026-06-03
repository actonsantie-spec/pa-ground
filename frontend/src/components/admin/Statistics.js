import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { request } from '../../api/apiClient';

const PlatformStatistics = () => {
    const [dateRange, setDateRange] = useState('30days');

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
    });

    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [topSellers, setTopSellers] = useState([]);
    const [topLocations, setTopLocations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchStats() {
            setLoading(true);
            setError(null);
            try {
                const data = await request(`/api/admin/stats?range=${dateRange}`, { signal: controller.signal });
                if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
                if (data.monthlyData) setMonthlyData(data.monthlyData);
                if (data.categoryBreakdown) setCategoryBreakdown(data.categoryBreakdown);
                if (data.topSellers) setTopSellers(data.topSellers);
                if (data.topLocations) setTopLocations(data.topLocations);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Failed to load admin stats', err);
                    setError('Failed to load statistics');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
        return () => controller.abort();
    }, [dateRange]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Platform Statistics</h1>
                    <p className="text-gray-600 mt-1">Analytics and insights for the Malawi Business Connector</p>
                </div>

                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="yearly">This Year</option>
                </select>
            </div>

            {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900">
                    Loading statistics...
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-100' },
                    { label: 'Active Users', value: stats.activeUsers, icon: '✅', color: 'bg-green-100' },
                    { label: 'Total Sellers', value: stats.totalSellers, icon: '🏪', color: 'bg-purple-100' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-orange-100' },
                    { label: 'Revenue', value: `MK${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: '💰', color: 'bg-yellow-100' },
                    { label: 'Avg Order', value: `MK${stats.avgOrderValue.toLocaleString()}`, icon: '📊', color: 'bg-pink-100' },
                ].map((metric, idx) => (
                    <div key={idx} className={`${metric.color} rounded-lg p-4 text-center`}>
                        <p className="text-2xl mb-1">{metric.icon}</p>
                        <p className="text-xl font-bold text-secondary">{metric.value}</p>
                        <p className="text-xs text-gray-700 mt-1">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-accent" />
                        <h3 className="text-lg font-bold text-secondary">Monthly Trends</h3>
                    </div>

                    <div className="space-y-4">
                        {monthlyData.map((month, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-secondary">{month.month}</p>
                                    <p className="text-sm text-gray-600">{month.orders} orders</p>
                                </div>
                                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-accent h-full"
                                        style={{ width: `${(month.orders / 1850) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart size={20} className="text-accent" />
                        <h3 className="text-lg font-bold text-secondary">Category Breakdown</h3>
                    </div>

                    <div className="space-y-3">
                        {categoryBreakdown.map((category, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-secondary text-sm">{category.name}</p>
                                    <p className="text-sm text-gray-600">{category.percentage}%</p>
                                </div>
                                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-accent h-full"
                                        style={{ width: `${category.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Sellers & Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Sellers */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-secondary mb-4">Top Sellers</h3>

                    <div className="space-y-3">
                        {topSellers.map(seller => (
                            <div key={seller.rank} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-accent text-lg w-6">#{seller.rank}</span>
                                    <div>
                                        <p className="font-semibold text-secondary">{seller.name}</p>
                                        <p className="text-xs text-gray-600">{seller.sales} sales</p>
                                    </div>
                                </div>
                                <p className="font-bold text-secondary">MK{(seller.revenue / 1000000).toFixed(1)}M</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Location</h3>

                    <div className="space-y-3">
                        {topLocations.map((location, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-gray-900">{location.location}</p>
                                    <p className="text-sm text-gray-600">{location.orders} orders ({location.percentage}%)</p>
                                </div>
                                <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-accent h-full"
                                        style={{ width: `${location.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Export Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-3">Export Reports</h3>
                <div className="flex gap-3 flex-wrap">
                    {['CSV', 'PDF', 'Excel'].map(format => (
                        <button
                            key={format}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Export as {format}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlatformStatistics;
