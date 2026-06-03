import React, { useState, useEffect } from 'react';
import { Package, Eye, ShoppingCart, Trash2, MessageCircle, Plus, Minus, AlertCircle, Clock } from 'lucide-react';
import SmartTracker from '../SmartTracker';
import { fetchOrders } from '../../api/orders';
import { subscribeToOrder } from '../../socket/socketClient';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reorderItems, setReorderItems] = useState([]);
    const [countdown, setCountdown] = useState({});
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const normalizeOrder = (order) => {
        if (!order) return order;
        return {
            ...order,
            status: String(order.status || '').toLowerCase(),
            total: order.totalAmount || order.total || 0,
            orderDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
            seller: order.seller?.businessName || order.seller || 'Seller',
            items: (order.items || []).map(item => ({
                ...item,
                name: item.product?.title || item.name || item.productId || 'Product',
            })),
            currentLocation: typeof order.deliveryAddress === 'string'
                ? order.deliveryAddress
                : order.deliveryAddress ? JSON.stringify(order.deliveryAddress) : '',
        };
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            placed: 'bg-gray-200 text-gray-800',
            confirmed: 'bg-blue-200 text-blue-800',
            packed: 'bg-purple-200 text-purple-800',
            dispatched: 'bg-orange-200 text-orange-800',
            transit: 'bg-yellow-200 text-yellow-800',
            delivery: 'bg-green-200 text-green-800',
            delivered: 'bg-green-600 text-white',
        };
        return colors[status] || 'bg-gray-200 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            placed: 'Order Placed',
            confirmed: 'Confirmed',
            packed: 'Packed',
            dispatched: 'Dispatched',
            transit: 'In Transit',
            delivery: 'Out for Delivery',
            delivered: 'Delivered',
        };
        return labels[status] || status;
    };

    const handleReorderItem = (item) => {
        // Add item to reorder list
        const existingItem = reorderItems.find(i => i.name === item.name);
        if (existingItem) {
            setReorderItems(
                reorderItems.map(i =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                )
            );
        } else {
            setReorderItems([...reorderItems, { ...item }]);
        }
    };

    const handleRemoveReorderItem = (itemName) => {
        setReorderItems(reorderItems.filter(i => i.name !== itemName));
    };

    const handleUpdateReorderQuantity = (itemName, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveReorderItem(itemName);
            return;
        }
        setReorderItems(
            reorderItems.map(i =>
                i.name === itemName ? { ...i, quantity: newQuantity } : i
            )
        );
    };

    // Load orders from backend
    useEffect(() => {
        let mounted = true;
        async function loadOrders() {
            setLoadingOrders(true);
            setOrderError(null);
            try {
                const data = await fetchOrders();
                if (mounted) setOrders(data.map(normalizeOrder));
            } catch (err) {
                console.error(err);
                if (mounted) setOrderError('Unable to load orders');
            } finally {
                if (mounted) setLoadingOrders(false);
            }
        }
        loadOrders();
        return () => { mounted = false; };
    }, []);

    // Calculate countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdown = {};
            const currentDate = new Date();
            orders.forEach(order => {
                const status = String(order.status || '').toLowerCase();
                if (order.estimatedDelivery && status !== 'delivered') {
                    const deliveryDate = new Date(order.estimatedDelivery);
                    const timeDiff = deliveryDate.getTime() - currentDate.getTime();

                    if (timeDiff > 0) {
                        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                        newCountdown[order.id] = { days, hours, minutes, isDelayed: false };
                    } else {
                        newCountdown[order.id] = { days: 0, hours: 0, minutes: 0, isDelayed: true };
                    }
                } else {
                    newCountdown[order.id] = { days: 0, hours: 0, minutes: 0, isDelayed: false };
                }
            });
            setCountdown(newCountdown);
        }, 1000);

        return () => clearInterval(timer);
    }, [orders]);

    useEffect(() => {
        if (!selectedOrder?.id) return;

        const unsubscribe = subscribeToOrder(selectedOrder.id, ({ orderId, checkpoint }) => {
            if (!checkpoint || orderId !== selectedOrder.id) return;
            setSelectedOrder(prev => {
                if (!prev || prev.id !== orderId) return prev;
                return {
                    ...prev,
                    status: String(checkpoint.status || prev.status).toLowerCase(),
                };
            });
        });

        return () => unsubscribe();
    }, [selectedOrder?.id]);

    if (selectedOrder) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-accent hover:underline font-semibold flex items-center gap-1"
                >
                    ← Back to Orders
                </button>

                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            <p className="text-gray-600 font-mono mt-1">{selectedOrder.id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                            {getStatusLabel(selectedOrder.status)}
                        </span>
                    </div>

                    {/* Delay Alert */}
                    {countdown[selectedOrder.id]?.isDelayed && selectedOrder.status !== 'delivered' && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
                            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-red-900">Order Delayed!</p>
                                <p className="text-sm text-red-800 mt-1">
                                    Your order was expected on {selectedOrder.estimatedDelivery} but hasn't been delivered yet. 
                                    We've notified the seller and you'll receive an update via email and WhatsApp.
                                </p>
                                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded transition-colors">
                                    Contact Seller
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.orderDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Seller</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.seller}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-semibold text-accent text-lg">MK{selectedOrder.total.toLocaleString()}</p>
                        </div>
                        {selectedOrder.estimatedDelivery && selectedOrder.status !== 'delivered' && (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                                    <Clock size={16} />
                                    Delivery Countdown
                                </p>
                                <p className="font-bold text-blue-900 text-lg mt-1">
                                    {countdown[selectedOrder.id]?.days || 0}d {countdown[selectedOrder.id]?.hours || 0}h
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Expected: {selectedOrder.estimatedDelivery}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Smart Tracker (status timeline + map + checkpoints) */}
                <SmartTracker
                    orderId={selectedOrder.id}
                    initialStatus={selectedOrder.status}
                    initialLocation={selectedOrder.currentLocation}
                />

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Items in This Order</h3>
                    <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 hover:bg-gray-50 p-3 rounded transition-colors">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">Price: MK{item.price.toLocaleString()}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="font-semibold text-gray-900">MK{(item.price * item.quantity).toLocaleString()}</p>
                                    {selectedOrder.status === 'delivered' && (
                                        <button
                                            onClick={() => handleReorderItem(item)}
                                            className="text-accent hover:text-red-700 font-semibold text-sm px-3 py-1 rounded hover:bg-accent hover:bg-opacity-10 transition-colors flex items-center gap-1 ml-auto"
                                            title="Add to reorder"
                                        >
                                            <ShoppingCart size={16} />
                                            Reorder
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Seller */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <MessageCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <p className="font-semibold text-blue-900">Have questions about this order?</p>
                            <p className="text-sm text-blue-800 mt-1">Contact the seller on WhatsApp or view reorder options below</p>
                        </div>
                    </div>
                    <button className="w-full bg-accent hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors">
                        Message Seller on WhatsApp
                    </button>
                </div>

                {/* Reorder Section */}
                {reorderItems.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                            <ShoppingCart size={20} />
                            Reorder Items
                        </h3>
                        <div className="space-y-3">
                            {reorderItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white rounded p-4 border border-gray-200">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">MK{item.price.toLocaleString()} each</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50">
                                            <button
                                                onClick={() => handleUpdateReorderQuantity(item.name, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
                                                title="Decrease quantity"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="px-4 font-bold text-gray-900 min-w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateReorderQuantity(item.name, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
                                                title="Increase quantity"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        <div className="text-right min-w-24">
                                            <p className="font-bold text-gray-900">MK{(item.price * item.quantity).toLocaleString()}</p>
                                            <button
                                                onClick={() => handleRemoveReorderItem(item.name)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded mt-1 hover:text-red-700 transition-colors"
                                                title="Remove from reorder"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reorder Summary */}
                        <div className="bg-white rounded p-4 border border-green-200 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Items:</span>
                                <span className="font-semibold">{reorderItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                                <span>Total:</span>
                                <span className="text-green-600">MK{reorderItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <ShoppingCart size={20} />
                            Add {reorderItems.reduce((sum, i) => sum + i.quantity, 0)} Item{reorderItems.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''} to Cart
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

            {orderError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                    {orderError}
                </div>
            )}
            {loadingOrders && (
                <div className="bg-white rounded-lg p-6 text-center text-gray-600">
                    Loading your orders…
                </div>
            )}
            {!loadingOrders && orders.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center space-y-4">
                    <Package size={48} className="mx-auto text-gray-400" />
                    <p className="text-gray-600 text-lg">No orders yet</p>
                    <button className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
                        Start Shopping
                    </button>
                </div>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        {/* Delay Alert Badge */}
                        {countdown[order.id]?.isDelayed && order.status !== 'delivered' && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                                <span className="text-sm font-semibold text-red-700">⚠️ This order is delayed! Check details for more info.</span>
                            </div>
                        )}

                        {/* Order Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-mono">Order ID: {order.id}</p>
                                <h3 className="text-lg font-bold text-gray-900 mt-1">{order.seller}</h3>

                                {/* Items Preview */}
                                <div className="mt-2 space-y-1">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, idx) => (
                                            <p key={idx} className="text-sm text-gray-600">
                                                {item.quantity}× {item.name}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-600">No items available</p>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mt-3">{getStatusLabel(order.status || '')}</p>
                                <p className="text-xl font-bold text-accent">MK{order.total?.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Order Meta */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200 text-sm">
                            <div>
                                <p className="text-gray-600">Order Date</p>
                                <p className="font-semibold text-gray-900">{order.orderDate}</p>
                            </div>
                            {order.estimatedDelivery && order.status !== 'delivered' && (
                                <div className={`${countdown[order.id]?.isDelayed ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'} p-2 rounded`}>
                                    <p className={`text-xs font-semibold ${countdown[order.id]?.isDelayed ? 'text-red-600' : 'text-blue-600'}`}>
                                        {countdown[order.id]?.isDelayed ? '❌ DELAYED' : '⏱️ Countdown'}
                                    </p>
                                    {!countdown[order.id]?.isDelayed && (
                                        <p className={`font-bold ${countdown[order.id]?.isDelayed ? 'text-red-700' : 'text-blue-700'}`}>
                                            {countdown[order.id]?.days}d {countdown[order.id]?.hours}h left
                                        </p>
                                    )}
                                    <p className={`text-xs ${countdown[order.id]?.isDelayed ? 'text-red-600' : 'text-blue-600'}`}>
                                        Due: {order.estimatedDelivery}
                                    </p>
                                </div>
                            )}
                            {order.deliveredDate && (
                                <div>
                                    <p className="text-gray-600">Delivered</p>
                                    <p className="font-semibold text-green-600">{order.deliveredDate}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Eye size={18} />
                                Track Order
                            </button>
                            {order.status === 'delivered' && (
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setReorderItems(order.items);
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    title="Reorder items from this order"
                                >
                                    <ShoppingCart size={18} />
                                    Reorder
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderTracking;
