import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

const LOCATIONS = [
    { id: 1, name: 'Lilongwe', count: 542 },
    { id: 2, name: 'Blantyre', count: 456 },
    { id: 3, name: 'Mzuzu', count: 234 },
    { id: 4, name: 'Zomba', count: 178 },
    { id: 5, name: 'Kasungu', count: 89 },
    { id: 6, name: 'Salima', count: 67 },
    { id: 7, name: 'Mangochi', count: 112 },
    { id: 8, name: 'Dedza', count: 45 },
    { id: 9, name: 'Ntcheu', count: 38 },
    { id: 10, name: 'Karonga', count: 56 },
    { id: 11, name: 'Rumphi', count: 34 },
    { id: 12, name: 'Mzimba', count: 78 },
    { id: 13, name: 'Nkhata Bay', count: 52 },
    { id: 14, name: 'Chitipa', count: 29 },
    { id: 15, name: 'Mulanje', count: 98 },
    { id: 16, name: 'Thyolo', count: 87 },
    { id: 17, name: 'Chiradzulu', count: 65 },
    { id: 18, name: 'Machinga', count: 73 },    
    { id: 19, name: 'Balaka', count: 41 },
    { id: 20, name: 'Chikwawa', count: 53 },
    { id: 21, name: 'Nsanje', count: 39 },
    { id: 22, name: 'Neno', count: 31 },
    { id: 23, name: 'Phalombe', count: 44 },
    { id: 24, name: 'Dowa', count: 36 },
    { id: 25, name: 'Nkhotakota', count: 47 },
    { id: 26, name: 'Liwonde', count: 28 },
    { id: 27, name: 'Likoma', count: 12 },
];

const LocationFilter = ({ selectedLocation = null, onLocationChange = () => {}, isOpen = false, onToggle = () => {} }) => {
    return (
        <div className="space-y-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <MapPin size={18} />
                    Town/District
                </span>
                <ChevronDown
                    size={20}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-2 max-h-96 overflow-y-auto">
                    <button
                        onClick={() => onLocationChange(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedLocation === null
                                ? 'bg-accent text-white font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        All Locations
                    </button>

                    {LOCATIONS.map(location => (
                        <button
                            key={location.id}
                            onClick={() => onLocationChange(location.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition-colors ${
                                selectedLocation === location.id
                                    ? 'bg-accent text-white font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{location.name}</span>
                            <span
                                className={`text-xs px-2 py-1 rounded ${
                                    selectedLocation === location.id
                                        ? 'bg-white bg-opacity-20'
                                        : 'bg-gray-200'
                                }`}
                            >
                                {location.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationFilter;
