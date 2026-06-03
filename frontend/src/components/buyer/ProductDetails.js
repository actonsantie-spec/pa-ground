import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, Share2 } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';
import { useAppContext } from '../../contexts/AppContext';
import { fetchProductById } from '../../api/products';

const ProductDetails = ({ onBack = () => {} }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useAppContext();

    useEffect(() => {
        let mounted = true;
        async function loadProduct() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProductById(id);
                if (mounted) setProduct(data);
            } catch (err) {
                console.error(err);
                if (mounted) setError('Unable to load product details');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadProduct();
        return () => { mounted = false; };
    }, [id]);

    const productImages = product?.images?.length ? product.images : ['https://via.placeholder.com/400'];
    const sellerName = product?.seller?.businessName || 'Seller';
    const categoryName = product?.category?.name || 'General';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading product details…</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
                    <button onClick={() => navigate('/search')} className="bg-accent text-white px-4 py-2 rounded-lg">
                        Back to Browse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => (onBack ? onBack() : navigate(-1))} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Images */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Main Image */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-md">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage === idx ? 'border-accent' : 'border-gray-200'
                                    }`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Product Info */}
                        <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="bg-accent text-white px-3 py-1 rounded-full">
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span>{categoryName}</span>
                            </div>

                            {/* Price */}
                            <div className="text-4xl font-bold text-accent">
                                MK{product.price.toLocaleString()}
                            </div>

                            {/* Stock */}
                            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>

                            {/* Description */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>
                            </div>

                            {/* Specifications */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-bold text-gray-900 mb-3">Product Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-xs text-gray-600">Category</p>
                                        <p className="font-semibold text-gray-900">{categoryName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-xs text-gray-600">Seller</p>
                                        <p className="font-semibold text-gray-900">{sellerName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Add to Cart Card */}
                        <div className="bg-white rounded-lg p-6 shadow-md space-y-4 sticky top-24">
                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="flex-1 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => addToCart({
                                    id: product.id,
                                    name: product.title,
                                    price: product.price,
                                    image: productImages[0],
                                }, quantity)}
                                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors"
                                disabled={product.stock <= 0}
                            >
                                Add to Cart
                            </button>

                            {/* Share Button */}
                            <button className="w-full border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Share2 size={20} />
                                Share
                            </button>
                        </div>

                        {/* Seller Card */}
                        <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg">Seller Information</h3>

                            {/* Seller Name & Rating */}
                            <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900">{sellerName}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < Math.floor(product.seller?.rating || 4) ? '#fbbf24' : '#e5e7eb'}
                                                color={i < Math.floor(product.seller?.rating || 4) ? '#fbbf24' : '#e5e7eb'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {(product.seller?.rating || 4).toFixed(1)} ({product.seller?.reviews || 0} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Seller Details */}
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>
                                    <strong>Member Since:</strong> {product.seller?.createdAt ? new Date(product.seller.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin size={16} /> {product.seller?.location || 'Malawi'}
                                </p>
                                <p>{product.seller?.responseTime || 'Usually responds within 1 hour'}</p>
                            </div>

                            {/* Contact Buttons */}
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <WhatsAppButton
                                    sellerName={sellerName}
                                    productName={product.title}
                                    phoneNumber={product.seller?.phone || '+265000000000'}
                                />
                                <button className="w-full border-2 border-accent text-accent font-semibold py-2 rounded-lg hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <Phone size={18} />
                                    Call Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
