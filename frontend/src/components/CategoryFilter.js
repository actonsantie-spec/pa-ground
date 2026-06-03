import React from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = [
    { id: 1, name: 'Phones & Accessories', count: 234 },
    { id: 2, name: 'Electronics', count: 156 },
    { id: 3, name: 'Clothes & Fashion', count: 342 },
    { id: 4, name: 'Farming Products', count: 89 },
    { id: 5, name: 'Building Materials', count: 127 },
    { id: 6, name: 'Furniture', count: 98 },
    { id: 7, name: 'Food & Groceries', count: 456 },
    { id: 8, name: 'Services', count: 203 },
];

const CategoryFilter = ({ selectedCategory = null, onCategoryChange = () => {}, isOpen = false, onToggle = () => {} }) => {
    return (
        <div className="space-y-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
            >
                <span>Categories</span>
                <ChevronDown
                    size={20}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-2 max-h-96 overflow-y-auto">
                    <button
                        onClick={() => onCategoryChange(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === null
                                ? 'bg-accent text-white font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        All Categories
                    </button>

                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition-colors ${
                                selectedCategory === category.id
                                    ? 'bg-accent text-white font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{category.name}</span>
                            <span
                                className={`text-xs px-2 py-1 rounded ${
                                    selectedCategory === category.id
                                        ? 'bg-white bg-opacity-20'
                                        : 'bg-gray-200'
                                }`}
                            >
                                {category.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;
