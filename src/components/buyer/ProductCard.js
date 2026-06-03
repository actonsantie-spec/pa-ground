import React, { useState } from 'react';
import { Star, Heart, MapPin, MessageCircle } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';

const ProductCard = ({ product = {}, onAddToCart = () => {}, onViewDetails = () => {} }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const {
        id = 1,
        name = 'Product Name',
        price = 0,
        image = 'https://via.placeholder.com/200',
        condition = 'New',
        seller = 'Seller Name',
        location = 'Lilongwe',
        rating = 4.5,
        reviews = 23,
        inStock = true,
    } = product;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Image Container */}
            <div className="relative pb-full bg-gray-100 overflow-hidden h-48">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => onViewDetails(id)}
                />

                {/* Condition Badge */}
                <div className="absolute top-2 left-2 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    {condition}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                    <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#999'} />
                </button>

                {/* Stock Status */}
                {!inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Product Name */}
                <h3
                    className="font-bold text-secondary line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => onViewDetails(id)}
                >
                    {name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent">MK{price.toLocaleString()}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}
                                color={i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">({reviews})</span>
                </div>

                {/* Seller & Location */}
                <div className="space-y-1 border-t border-gray-200 pt-2">
                    <p className="text-sm font-semibold text-secondary">{seller}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin size={14} /> {location}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={() => onAddToCart(id)}
                    disabled={!inStock}
                    className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
