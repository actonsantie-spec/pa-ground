import React, { useState } from 'react';
import { Trash2, Eye, Flag, CheckCircle, Clock } from 'lucide-react';

const ListingModeration = () => {
    const [listings, setListings] = useState([
        {
            id: 1,
            productName: 'iPhone 12 Pro Max',
            seller: 'Tech Hub Malawi',
            price: 85000,
            image: 'https://via.placeholder.com/80',
            reports: 2,
            reportedFor: 'Suspected fake product',
            status: 'under_review',
            date: '2026-01-27',
        },
        {
            id: 2,
            productName: 'Building Bricks Bundle',
            seller: 'Construction Materials',
            price: 150000,
            image: 'https://via.placeholder.com/80',
            reports: 1,
            reportedFor: 'Illegal pricing',
            status: 'under_review',
            date: '2026-01-26',
        },
        {
            id: 3,
            productName: 'Designer Shoes (Fake)',
            seller: 'Fake Fashion Store',
            price: 25000,
            image: 'https://via.placeholder.com/80',
            reports: 5,
            reportedFor: 'Counterfeit product',
            status: 'flagged',
            date: '2026-01-25',
        },
        {
            id: 4,
            productName: 'Blue Polo T-Shirt',
            seller: 'Fashion Store',
            price: 3500,
            image: 'https://via.placeholder.com/80',
            reports: 0,
            reportedFor: '',
            status: 'approved',
            date: '2026-01-24',
        },
        {
            id: 5,
            productName: 'Stolen Laptop',
            seller: 'Unknown Seller',
            price: 120000,
            image: 'https://via.placeholder.com/80',
            reports: 8,
            reportedFor: 'Stolen goods',
            status: 'flagged',
            date: '2026-01-23',
        },
    ]);

    const [selectedListing, setSelectedListing] = useState(null);
    const [filter, setFilter] = useState('flagged');

    const filteredListings = filter === 'all' ? listings : listings.filter(l => l.status === filter);

    const handleApprove = (id) => {
        setListings(listings.map(l =>
            l.id === id ? { ...l, status: 'approved' } : l
        ));
    };

    const handleRemove = (id) => {
        setListings(listings.filter(l => l.id !== id));
    };

    const handleFlag = (id) => {
        setListings(listings.map(l =>
            l.id === id ? { ...l, status: 'flagged' } : l
        ));
    };

    const getStatusBadge = (status) => {
        const colors = {
            under_review: 'bg-yellow-100 text-yellow-800',
            flagged: 'bg-accent text-white',
            approved: 'bg-primary text-white',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            under_review: 'Under Review',
            flagged: 'Flagged',
            approved: 'Approved',
        };
        return labels[status] || status;
    };

    if (selectedListing) {
        const listing = listings.find(l => l.id === selectedListing);

        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedListing(null)}
                    className="text-accent hover:underline font-semibold"
                >
                    ← Back to Listings
                </button>

                {/* Listing Details */}
                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                    <div className="flex gap-6 items-start">
                        <img
                            src={listing.image}
                            alt={listing.productName}
                            className="w-48 h-48 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-secondary">{listing.productName}</h2>
                                    <p className="text-gray-600 mt-1">By: {listing.seller}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadge(listing.status)}`}>
                                    {getStatusLabel(listing.status)}
                                </span>
                            </div>

                            <div className="space-y-3 mt-6">
                                <div>
                                    <p className="text-sm text-gray-600">Price</p>
                                    <p className="text-2xl font-bold text-accent">MK{listing.price.toLocaleString()}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Listed Date</p>
                                    <p className="font-semibold text-gray-900">{listing.date}</p>
                                </div>

                                {listing.reports > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-900">
                                            <strong>Reports:</strong> {listing.reports} user(s) reported this listing
                                        </p>
                                        <p className="text-sm text-red-900 mt-1">
                                            <strong>Reason:</strong> {listing.reportedFor}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <h3 className="font-bold text-gray-900">Moderation Actions</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                onClick={() => {
                                    handleApprove(listing.id);
                                    setSelectedListing(null);
                                }}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Approve Listing
                            </button>

                            <button
                                onClick={() => {
                                    handleFlag(listing.id);
                                    setSelectedListing(null);
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Flag size={20} />
                                Flag for Review
                            </button>

                            <button
                                onClick={() => {
                                    handleRemove(listing.id);
                                    setSelectedListing(null);
                                }}
                                className="bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} />
                                Remove Listing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-secondary">Listing Moderation</h1>
                <p className="text-gray-600 mt-1">Review and moderate product listings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Flagged', value: listings.filter(l => l.status === 'flagged').length, color: 'bg-accent text-white' },
                    { label: 'Under Review', value: listings.filter(l => l.status === 'under_review').length, color: 'bg-secondary text-white' },
                    { label: 'Approved', value: listings.filter(l => l.status === 'approved').length, color: 'bg-primary text-white' },
                ].map((stat, idx) => (
                    <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm font-semibold mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex gap-2">
                    {['flagged', 'under_review', 'approved', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                filter === status
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            }`}
                        >
                            {status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listings List */}
            {filteredListings.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-gray-600 text-lg">No listings found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredListings.map(listing => (
                        <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex gap-4">
                                {/* Image */}
                                <img
                                    src={listing.image}
                                    alt={listing.productName}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                />

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{listing.productName}</h3>
                                            <p className="text-sm text-gray-600">Seller: {listing.seller}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full font-semibold text-xs whitespace-nowrap ${getStatusBadge(listing.status)}`}>
                                            {getStatusLabel(listing.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm my-3">
                                        <div>
                                            <p className="text-gray-600">Price</p>
                                            <p className="font-bold text-accent">MK{listing.price.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Date</p>
                                            <p className="font-semibold text-gray-900">{listing.date}</p>
                                        </div>
                                        {listing.reports > 0 && (
                                            <div>
                                                <p className="text-gray-600">Reports</p>
                                                <p className="font-bold text-red-600">{listing.reports}</p>
                                            </div>
                                        )}
                                    </div>

                                    {listing.reportedFor && (
                                        <div className="bg-red-50 border border-red-200 rounded px-3 py-1 text-xs text-red-800">
                                            <strong>Issue:</strong> {listing.reportedFor}
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => setSelectedListing(listing.id)}
                                    className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Eye size={18} />
                                    Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListingModeration;
