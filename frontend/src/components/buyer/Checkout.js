import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import PaymentMethods from '../PaymentMethods';
import { useAppContext } from '../../contexts/AppContext';
import { createOrder } from '../../api/orders';

const Checkout = ({ onConfirmOrder = () => {} }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        location: '',
        notes: '',
        paymentMethod: 'upon-delivery',
    });

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const { cartItems, cartTotal, clearCart } = useAppContext();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.fullName || !formData.phone || !formData.address || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        setOrderError(null);

        if (!cartItems.length) {
            setOrderError('Your cart is empty. Add items before placing an order.');
            setSubmitting(false);
            return;
        }

        const sellerIds = Array.from(new Set(cartItems.map(item => item.sellerId)));
        if (sellerIds.length > 1) {
            setOrderError('All products in the cart must be from the same seller. Please order separately.');
            setSubmitting(false);
            return;
        }

        const items = cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price }));

        const payload = {
            sellerId: sellerIds[0],
            items,
            deliveryAddress: {
                street: formData.address,
                city: formData.location,
                notes: formData.notes,
            },
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        };

        try {
            const order = await createOrder(payload);
            const newOrderId = order.id || order.order?.id || `TGL${Date.now()}`;
            setOrderId(newOrderId);
            setOrderPlaced(true);
            clearCart();
            onConfirmOrder({
                ...formData,
                orderId: newOrderId,
                total: cartTotal,
                order,
            });
        } catch (error) {
            console.error(error);
            setOrderError(error.message || 'Unable to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle size={80} className="text-green-600" />
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600">Thank you for your purchase</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
                    <p className="text-2xl font-bold text-accent font-mono">{orderId}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-blue-900">
                        <strong>Next Steps:</strong>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>You will receive a WhatsApp confirmation from the seller</li>
                            <li>Seller will contact you to confirm delivery details</li>
                            <li>Track your order status in "My Orders"</li>
                        </ul>
                    </p>
                </div>

                <div className="space-y-2">
                    <button className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors">
                        Track Order
                    </button>
                    <button className="w-full border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8 flex gap-4">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                s <= step
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {s}
                        </div>
                        <span className="hidden sm:inline text-sm text-gray-600">
                            {s === 1 ? 'Delivery' : s === 2 ? 'Payment' : 'Review'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="+265 999 000 000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="123 Main Street"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Town/District *
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            >
                                <option value="">Select location</option>
                                <option value="lilongwe">Lilongwe</option>
                                <option value="blantyre">Blantyre</option>
                                <option value="mzuzu">Mzuzu</option>
                                <option value="zomba">Zomba</option>
                                <option value="kasungu">Kasungu</option>
                                <option value="salima">Salima</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Delivery Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Any special instructions for delivery..."
                                rows="3"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>
                        <PaymentMethods />
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Review Order</h3>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="font-semibold text-gray-900">{formData.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone</p>
                                <p className="font-semibold text-gray-900">{formData.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Delivery Address</p>
                                <p className="font-semibold text-gray-900">
                                    {formData.address}, {formData.location}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Method</p>
                                <p className="font-semibold text-gray-900">{formData.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="bg-accent bg-opacity-10 border border-accent rounded-lg p-4">
                            <p className="text-xl font-bold text-accent">
                                Total: MK{cartTotal.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {orderError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
                        {orderError}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Previous
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (step === 1 && (!formData.fullName || !formData.phone || !formData.address || !formData.location)) {
                                    alert('Please fill in all required fields');
                                    return;
                                }
                                setStep(step + 1);
                            }}
                            className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors"
                            disabled={submitting}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={`flex-1 font-bold py-3 rounded-lg transition-colors ${submitting ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            disabled={submitting}
                        >
                            {submitting ? 'Placing order...' : 'Place Order'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Checkout;
