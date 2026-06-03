import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const ShoppingCart = ({ onCheckout = () => {} }) => {
    const { cartItems, updateCartItem, removeFromCart } = useAppContext();

    const updateQuantity = (id, newQuantity) => {
        updateCartItem(id, newQuantity);
    };

    const removeItem = (id) => {
        removeFromCart(id);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5000; // Fixed shipping for demo
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center space-y-6">
                <div className="flex justify-center">
                    <ShoppingBag size={64} className="text-gray-300" />
                </div>
                <div>
                    <p className="text-gray-600 text-xl font-semibold mb-2">Your cart is empty</p>
                    <p className="text-gray-500">Start adding items to your cart to see them here</p>
                </div>
                <a href="/search" className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Continue Shopping
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({cartItems.length})</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                        <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            />

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{item.seller}</p>
                                <p className="text-lg font-bold text-accent">MK{item.price.toLocaleString()}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
                                    title="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-3 font-bold text-sm text-gray-900 min-w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
                                    title="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right min-w-28 space-y-2">
                                <p className="font-bold text-gray-900 text-lg">
                                    MK{(item.price * item.quantity).toLocaleString()}
                                </p>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1 rounded transition-colors flex items-center gap-1 ml-auto"
                                    title="Remove item from cart"
                                >
                                    <Trash2 size={16} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4 max-w-md ml-auto sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-accent" />
                    Order Summary
                </h3>

                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</p>
                </div>

                <div className="space-y-2 text-sm border-b border-gray-200 pb-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">MK{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-gray-900">MK{shipping.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-accent text-xl">MK{total.toLocaleString()}</span>
                </div>

                <button
                    onClick={onCheckout}
                    className="w-full bg-accent hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                </button>

                <a href="/search" className="w-full border-2 border-gray-300 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors block text-center">
                    Continue Shopping
                </a>
            </div>
        </div>
    );
};

export default ShoppingCart;
