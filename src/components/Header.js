import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount, user, logout } = useAppContext();

    return (
        <header className="bg-secondary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-b from-red-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold">
                            M
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:inline">Tigulane</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 items-center">
                        <Link to="/search" className="text-gray-200 hover:text-accent transition-colors">
                            Browse
                        </Link>
                        <Link to="/sellers" className="text-gray-200 hover:text-accent transition-colors">
                            Sellers
                        </Link>
                        <Link to="/seller-signup" className="text-gray-200 hover:text-accent transition-colors">
                            Sell
                        </Link>
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-secondary-light rounded-lg transition-colors">
                            <Search size={20} className="text-accent" />
                        </button>
                        <Link to="/orders" className="p-2 hover:bg-secondary-light rounded-lg transition-colors relative">
                            <ShoppingCart size={20} className="text-accent" />
                            <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </Link>
                        {user ? (
                          <button onClick={logout} className="p-2 hover:bg-secondary-light rounded-lg transition-colors text-white text-sm">
                              Logout
                          </button>
                        ) : (
                          <Link to="/buyer-login" className="p-2 hover:bg-secondary-light rounded-lg transition-colors">
                              <User size={20} className="text-accent" />
                          </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-secondary-light rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden pb-4 border-t border-secondary-light">
                        <Link to="/search" className="block py-2 text-gray-300 hover:text-accent">
                            Browse Products
                        </Link>
                        <Link to="/sellers" className="block py-2 text-gray-300 hover:text-accent">
                            Find Sellers
                        </Link>
                        <Link to="/seller-signup" className="block py-2 text-gray-300 hover:text-accent">
                            Start Selling
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
