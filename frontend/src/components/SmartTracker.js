import React, { useState, useEffect } from 'react';
import OrderStatusTracker from './OrderStatusTracker';
import MapView from './MapView';
import { fetchOrderTracking } from '../api/orders';
import { subscribeToOrder, subscribeSocketStatus } from '../socket/socketClient';

const SmartTracker = ({ orderId, initialStatus = 'placed', initialLocation = '' }) => {
    const [track, setTrack] = useState({
        checkpoints: [],
        currentStatus: String(initialStatus || 'placed').toLowerCase(),
        currentLocation: initialLocation,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [socketStatus, setSocketStatus] = useState('disconnected');

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function fetchTrack() {
            if (!orderId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await fetchOrderTracking(orderId, { signal: controller.signal });
                if (mounted) {
                    setTrack(prev => ({
                        ...prev,
                        checkpoints: (data.checkpoints || []).map(cp => ({ ...cp, time: cp.time || cp.recordedAt })),
                        currentStatus: String(data.currentStatus || prev.currentStatus).toLowerCase(),
                        currentLocation: typeof data.currentLocation === 'string' ? data.currentLocation : JSON.stringify(data.currentLocation),
                    }));
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('tracking fetch failed', err);
                    setError('Unable to load live tracking');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchTrack();
        const iv = setInterval(fetchTrack, 10000);

        const unsubscribeStatus = subscribeSocketStatus((status, payload) => {
            setSocketStatus(status);
            if (status === 'error' && mounted) {
                setError(`Real-time connection error: ${payload || 'Unable to connect'}`);
            }
        });

        const unsubscribeOrder = orderId
            ? subscribeToOrder(orderId, ({ orderId: incomingOrderId, checkpoint }) => {
                if (!mounted || incomingOrderId !== orderId || !checkpoint) return;
                const normalizedCheckpoint = { ...checkpoint, time: checkpoint.time || checkpoint.recordedAt };
                setTrack(prev => {
                    const existing = prev.checkpoints || [];
                    const isDuplicate = existing.some((cp) => cp.id && normalizedCheckpoint.id ? cp.id === normalizedCheckpoint.id : cp.time === normalizedCheckpoint.time && cp.location === normalizedCheckpoint.location);
                    return {
                        ...prev,
                        checkpoints: isDuplicate ? existing : [...existing, normalizedCheckpoint],
                        currentStatus: String(normalizedCheckpoint.status || prev.currentStatus).toLowerCase(),
                        currentLocation: normalizedCheckpoint.location || prev.currentLocation,
                    };
                });
            })
            : () => {};

        return () => {
            mounted = false;
            controller.abort();
            clearInterval(iv);
            unsubscribeStatus();
            unsubscribeOrder();
        };
    }, [orderId]);

    const coords = (track.checkpoints || []).map(cp => ({ lat: cp.lat, lon: cp.lon }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <OrderStatusTracker currentStatus={track.currentStatus} currentLocation={track.currentLocation} />
                {loading && <p className="text-sm text-gray-500 mt-2">Loading live tracking…</p>}
                {socketStatus !== 'connected' && (
                    <p className="text-sm text-gray-500 mt-2">
                        Real-time tracking {socketStatus === 'connecting' ? 'connecting…' : socketStatus === 'reconnecting' ? 'reconnecting…' : socketStatus === 'disconnected' ? 'is not connected' : 'encountered an issue'}.
                    </p>
                )}
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <div>
                <MapView coords={coords} />

                <div className="mt-3 bg-white rounded p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900">Recent Checkpoints</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                        {track.checkpoints && track.checkpoints.length > 0 ? (
                            track.checkpoints.slice().reverse().map((cp, idx) => (
                                <li key={idx} className="flex justify-between">
                                                    <span>{cp.location || `${cp.lat}, ${cp.lon}`}</span>
                                    <span className="text-xs text-gray-500">{cp.time ? new Date(cp.time).toLocaleString() : ''}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No checkpoints yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SmartTracker;
