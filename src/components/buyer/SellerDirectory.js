import React, { useState } from 'react';
import { MapPin, MessageCircle, Star } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';

const SellerDirectory = () => {
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [locationFilter, setLocationFilter] = useState('');

    const sellers = [
        {
            id: 1,
            name: 'Tech Hub Malawi',
            category: 'Electronics & Phones',
            location: 'Lilongwe',
            phone: '+265999000001',
            rating: 4.8,
            reviews: 156,
            products: 45,
            joinDate: '2023-01-15',
            description: 'Premium electronics and phone retailer. Fast delivery & genuine products guaranteed.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 30 minutes',
        },
        {
            id: 2,
            name: 'Fashion Store',
            category: 'Clothes & Fashion',
            location: 'Blantyre',
            phone: '+265999000002',
            rating: 4.6,
            reviews: 89,
            products: 120,
            joinDate: '2023-03-20',
            description: 'Latest fashion trends for men, women & kids. Quality assured clothing at affordable prices.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 1 hour',
        },
        {
            id: 3,
            name: 'Green Valley Farms',
            category: 'Farming & Agricultural Products',
            location: 'Lilongwe',
            phone: '+265999000003',
            rating: 4.7,
            reviews: 67,
            products: 32,
            joinDate: '2023-06-10',
            description: 'Fresh farming products directly from farms. Organic vegetables, fruits & seeds.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 2 hours',
        },
        {
            id: 4,
            name: 'Building Materials Plus',
            category: 'Building Materials',
            location: 'Mzuzu',
            phone: '+265999000004',
            rating: 4.5,
            reviews: 45,
            products: 78,
            joinDate: '2023-08-05',
            description: 'Complete building materials supply. Quality cement, bricks, timber & accessories.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 4 hours',
        },
        {
            id: 5,
            name: 'Home Furniture Gallery',
            category: 'Furniture',
            location: 'Blantyre',
            phone: '+265999000005',
            rating: 4.9,
            reviews: 123,
            products: 89,
            joinDate: '2023-02-12',
            description: 'Beautiful & durable furniture for every room. Custom designs available.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 1 hour',
        },
        {
            id: 6,
            name: 'Quick Services Hub',
            category: 'Services - Repairs & Tailoring',
            location: 'Lilongwe',
            phone: '+265999000006',
            rating: 4.4,
            reviews: 34,
            products: 15,
            joinDate: '2023-11-22',
            description: 'Professional tailoring, phone repairs, and general services. Fast turnaround.',
            logo: 'https://via.placeholder.com/100',
            responseTime: 'Usually responds within 30 minutes',
        },
    ];

    const locations = ['', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Salima', 'Mangochi', 'Dedza', 'Ntcheu', 'Karonga', 'Rumphi', 'Mzimba', 'Nkhata Bay', 'Chitipa', 'Mulanje', 'Thyolo', 'Chiradzulu', 'Machinga', 'Balaka', 'Chikwawa', 'Nsanje', 'Neno', 'Phalombe', 'Dowa', 'Nkhotakota', 'Liwonde', 'Likoma'];

    const filteredSellers = locationFilter
        ? sellers.filter(s => s.location === locationFilter)
        : sellers;

    if (selectedSeller) {
        const seller = sellers.find(s => s.id === selectedSeller);

        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedSeller(null)}
                    className="text-accent hover:underline font-semibold"
                >
                    ← Back to Sellers
                </button>

                {/* Seller Header */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <div className="flex gap-6 mb-6">
                        <img
                            src={seller.logo}
                            alt={seller.name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                            <p className="text-gray-600 mt-1">{seller.category}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(seller.rating) ? '#fbbf24' : '#e5e7eb'}
                                            color={i < Math.floor(seller.rating) ? '#fbbf24' : '#e5e7eb'}
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {seller.rating} ({seller.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="text-right">
                            <p className="flex items-center gap-1 text-gray-600 mb-2">
                                <MapPin size={18} /> {seller.location}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>{seller.products}</strong> Products Listed
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-gray-700">{seller.description}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t border-gray-200 pt-6">
                        <div>
                            <p className="text-xs text-gray-600 uppercase">Member Since</p>
                            <p className="font-bold text-gray-900">{seller.joinDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 uppercase">Response Time</p>
                            <p className="font-bold text-gray-900">{seller.responseTime}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 uppercase">Listed Products</p>
                            <p className="font-bold text-accent text-lg">{seller.products}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 uppercase">Total Sales</p>
                            <p className="font-bold text-gray-900">{seller.reviews}</p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-3">
                        <WhatsAppButton
                            sellerName={seller.name}
                            productName='asking about your products'
                            phoneNumber={seller.phone}
                        />
                        <button className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <MessageCircle size={20} />
                            Send Message
                        </button>
                    </div>
                </div>

                {/* Products by Seller */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Products by {seller.name}</h2>
                    <p className="text-gray-600 text-center py-8">
                        View {seller.products} products from this seller
                    </p>
                    <button className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-accent-dark transition-colors">
                        Browse All Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Find Sellers</h1>
                <p className="text-gray-600 mt-1">Browse our trusted network of sellers across Malawi</p>
            </div>

            {/* Location Filter */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Filter by Location
                </label>
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    {locations.map(loc => (
                        <option key={loc} value={loc}>
                            {loc || 'All Locations'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sellers List */}
            {filteredSellers.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-gray-600">No sellers found in {locationFilter}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSellers.map(seller => (
                        <div key={seller.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex gap-4 md:flex-row flex-col">
                                {/* Logo */}
                                <img
                                    src={seller.logo}
                                    alt={seller.name}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{seller.category}</p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < Math.floor(seller.rating) ? '#fbbf24' : '#e5e7eb'}
                                                    color={i < Math.floor(seller.rating) ? '#fbbf24' : '#e5e7eb'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">
                                            {seller.rating} ({seller.reviews})
                                        </span>
                                    </div>

                                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={16} /> {seller.location}
                                        </span>
                                        <span>{seller.products} Products</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedSeller(seller.id)}
                                        className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 rounded-lg transition-colors"
                                    >
                                        View Profile
                                    </button>
                                    <WhatsAppButton
                                        sellerName={seller.name}
                                        productName='asking about your products'
                                        phoneNumber={seller.phone}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDirectory;
