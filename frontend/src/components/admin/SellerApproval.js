import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle, Eye, MapPin, Phone } from 'lucide-react';
import { fetchAdminSellers, updateAdminSeller } from '../../api/admin';

const SellerApproval = () => {
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');

    const loadSellers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchAdminSellers({ query, perPage: 100 });
            const data = response.data || [];
            setSellers(data.map((seller) => ({
                ...seller,
                status: seller.approved ? 'approved' : 'pending',
                category: seller.category || 'General',
                town: seller.location || 'Malawi',
                owner: seller.contactName || 'N/A',
                joinDate: seller.joinDate ? new Date(seller.joinDate).toLocaleDateString() : 'N/A',
            })));
        } catch (err) {
            console.error('Failed to load sellers', err);
            setError('Unable to load seller applications.');
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        loadSellers();
    }, [loadSellers]);

    const handleApprove = async (id) => {
        try {
            const response = await updateAdminSeller(id, { approved: true });
            setSellers((prev) => prev.map((seller) => (seller.id === id ? { ...seller, approved: response.data.approved, status: response.data.approved ? 'approved' : 'pending' } : seller)));
        } catch (err) {
            console.error('Failed to approve seller', err);
            setError('Unable to approve seller.');
        }
    };

    const filteredSellers = filter === 'all' ? sellers : sellers.filter((s) => s.status === filter);

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-primary text-white',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (selectedSeller) {
        const seller = sellers.find((s) => s.id === selectedSeller);
        if (!seller) return null;

        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedSeller(null)} className="text-accent hover:underline font-semibold">
                    ← Back to Sellers
                </button>

                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary">{seller.name}</h2>
                            <p className="text-gray-600 mt-1">Owner: {seller.owner}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadge(seller.status)}`}>
                            {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Contact</p>
                                <p className="font-semibold text-gray-900">{seller.owner}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Town/District</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin size={16} /> {seller.town}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <a href={`tel:${seller.phone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-2">
                                    <Phone size={16} /> {seller.phone || 'N/A'}
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Application Date</p>
                                <p className="font-semibold text-gray-900">{seller.joinDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Product Count</p>
                                <p className="font-semibold text-gray-900">{seller.productCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-gray-900 mb-2">Overview</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Business name: {seller.name}. Contact: {seller.owner}. Seller approved: {seller.approved ? 'Yes' : 'No'}.
                        </p>
                    </div>

                    {!seller.approved && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <button
                                onClick={() => {
                                    handleApprove(seller.id);
                                    setSelectedSeller(null);
                                }}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg transition-colors"
                            >
                                <CheckCircle size={18} /> Approve Seller
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-secondary">Seller Approval</h1>
                <p className="text-gray-600 mt-1">Review and manage seller applications</p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search sellers by name or owner"
                        className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {['pending', 'approved', 'all'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === status ? 'bg-accent text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div className="text-red-600">{error}</div>}

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="bg-white rounded-lg p-6 text-gray-600">Loading sellers...</div>
                    ) : filteredSellers.length === 0 ? (
                        <div className="bg-white rounded-lg p-6 text-gray-600">No sellers found.</div>
                    ) : (
                        filteredSellers.map((seller) => (
                            <div key={seller.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{seller.category}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadge(seller.status)}`}>
                                        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-600">Owner</p>
                                        <p className="font-semibold text-gray-900">{seller.owner}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Location</p>
                                        <p className="font-semibold text-gray-900">{seller.town}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Applied Date</p>
                                        <p className="font-semibold text-gray-900">{seller.joinDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Products</p>
                                        <p className="font-semibold text-gray-900">{seller.productCount}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setSelectedSeller(seller.id)}
                                        className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold py-2 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} /> Review Application
                                    </button>
                                    {!seller.approved && (
                                        <button
                                            onClick={() => handleApprove(seller.id)}
                                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors"
                                        >
                                            <CheckCircle size={18} /> Approve Seller
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerApproval;
