import React from 'react';
import { Check, Truck, Package, MapPin, Clock } from 'lucide-react';

const ORDER_STATUSES = [
    { key: 'placed', label: 'Order Placed', icon: Check },
    { key: 'confirmed', label: 'Confirmed', icon: Check },
    { key: 'packed', label: 'Packed', icon: Package },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'transit', label: 'In Transit', icon: MapPin },
    { key: 'delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check },
];

const OrderStatusTracker = ({ currentStatus = 'placed', estimatedDelivery = '', currentLocation = '' }) => {
    const currentIndex = ORDER_STATUSES.findIndex(s => s.key === currentStatus);

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>

            {/* Status Timeline */}
            <div className="space-y-4">
                {ORDER_STATUSES.map((status, index) => {
                    const Icon = status.icon;
                    const isCompleted = index <= currentIndex;
                    const isActive = index === currentIndex;

                    return (
                        <div key={status.key} className="flex gap-4">
                            {/* Icon Circle */}
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 font-bold ${
                                    isCompleted
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                <Icon size={20} />
                            </div>

                            {/* Status Info */}
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold ${
                                        isActive ? 'text-accent' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                >
                                    {status.label}
                                </h4>

                                {/* Active Status Details */}
                                {isActive && (
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        {currentLocation && (
                                            <p>
                                                <strong>Location:</strong> {currentLocation}
                                            </p>
                                        )}
                                        {estimatedDelivery && (
                                            <p className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <strong>Estimated:</strong> {estimatedDelivery}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Completed Badge */}
                            {isCompleted && index < currentIndex && (
                                <span className="text-xs text-green-600 font-bold self-center">DONE</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-accent h-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / ORDER_STATUSES.length) * 100}%` }}
                />
            </div>

            {/* Status Percentage */}
            <p className="text-sm text-gray-600 mt-2 text-center">
                {Math.round(((currentIndex + 1) / ORDER_STATUSES.length) * 100)}% Complete
            </p>
        </div>
    );
};

export default OrderStatusTracker;
