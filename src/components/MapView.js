import React from 'react';

function buildStaticMapUrl(coords = [], width = 700, height = 300, zoom = 8) {
    if (!coords || coords.length === 0) return null;
    const last = coords[coords.length - 1];
    const center = `${last.lat},${last.lon}`;
    const size = `${Math.min(width, 800)}x${Math.min(height, 400)}`;
    const markers = coords.map(c => `${c.lat},${c.lon},red-pushpin`).join('|');
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${center}&zoom=${zoom}&size=${size}&markers=${encodeURIComponent(markers)}`;
}

const MapView = ({ coords = [], width = 700, height = 300, zoom = 8 }) => {
    const url = buildStaticMapUrl(coords, width, height, zoom);
    if (!url) return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-600">No location data available</div>
    );

    const last = coords[coords.length - 1];
    const osmLink = `https://www.openstreetmap.org/#map=${zoom}/${last.lat}/${last.lon}`;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <a href={osmLink} target="_blank" rel="noopener noreferrer">
                <img src={url} alt="Order location map" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </a>
        </div>
    );
};

export default MapView;
