import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search products, sellers...', onSearch = () => {}, onClear = () => {} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const POPULAR_SEARCHES = [
        'Phones',
        'Laptops',
        'Furniture',
        'Clothes',
        'Building Materials',
        'Electronics',
        'Farming Products',
    ];

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (value.length > 0) {
            const filtered = POPULAR_SEARCHES.filter(s =>
                s.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        onSearch(value);
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSuggestions([]);
        setShowSuggestions(false);
        onClear();
    };

    return (
        <div className="relative w-full">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent transition-all">
                <SearchIcon size={20} className="text-gray-400 ml-3 flex-shrink-0" />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400"
                />

                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <button className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-r-lg font-semibold transition-colors">
                    Search
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
                                >
                                    <SearchIcon size={16} className="text-gray-400" />
                                    {suggestion}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm">
                                No results for "{searchTerm}"
                            </div>
                        )}
                    </div>

                    {/* Popular Searches */}
                    {searchTerm.length === 0 && (
                        <>
                            <div className="border-t border-gray-200 px-4 py-2">
                                <p className="text-xs font-semibold text-gray-600 uppercase">Popular Searches</p>
                            </div>
                            <div className="py-1 max-h-48 overflow-y-auto">
                                {POPULAR_SEARCHES.slice(0, 5).map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectSuggestion(search)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
