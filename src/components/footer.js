import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const SOCIAL_LINKS = [
    { icon: Facebook, label: 'Facebook', url: '#facebook' },
    { icon: Twitter, label: 'Twitter', url: '#twitter' },
    { icon: Instagram, label: 'Instagram', url: '#instagram' },
    { icon: MessageCircle, label: 'WhatsApp', url: '#whatsapp' },
];

const BUYER_LINKS = [
    { label: 'Browse Products', to: '/search' },
    { label: 'Track Order', to: '/orders' },
    { label: 'My Purchases', to: '/purchases' },
    { label: 'Seller Directory', to: '/sellers' },
];

const SELLER_LINKS = [
    { label: 'Become a Seller', to: '/seller-signup' },
    { label: 'Seller Dashboard', to: '/seller-dashboard' },
    { label: 'Manage Products', to: '/seller/products' },
    { label: 'Seller Guidelines', url: '#seller-guidelines' },
];

const LEGAL_LINKS = [
    { label: 'Privacy Policy', url: '#privacy' },
    { label: 'Terms of Service', url: '#terms' },
    { label: 'Safety Tips', url: '#safety' },
    { label: 'Contact Support', to: '/support' },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-b from-red-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-base">
                                M
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">Tigulane</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Connecting Malawi's businesses and customers in a trusted marketplace.
                        </p>
                        <p className="text-xs text-gray-500">
                            Buy &amp; Sell across Lilongwe, Blantyre, Mzuzu &amp; more.
                        </p>
                        {/* Social Links */}
                        <nav className="flex gap-4 pt-2" aria-label="Social media links">
                            {SOCIAL_LINKS.map(({ icon: Icon, label, url }) => (
                                <a
                                    key={label}
                                    href={url}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md p-2"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* For Buyers */}
                    <div>
                        <h3 className="text-white font-bold mb-4 font-heading text-sm uppercase tracking-wider">
                            For Buyers
                        </h3>
                        <nav>
                            <ul className="space-y-2 text-sm">
                                {BUYER_LINKS.map(({ label, to, url }) => (
                                    <li key={label}>
                                        {to ? (
                                            <Link
                                                to={to}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={url}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* For Sellers */}
                    <div>
                        <h3 className="text-white font-bold mb-4 font-heading text-sm uppercase tracking-wider">
                            For Sellers
                        </h3>
                        <nav>
                            <ul className="space-y-2 text-sm">
                                {SELLER_LINKS.map(({ label, to, url }) => (
                                    <li key={label}>
                                        {to ? (
                                            <Link
                                                to={to}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={url}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-4 font-heading text-sm uppercase tracking-wider">
                            Legal &amp; Support
                        </h3>
                        <nav>
                            <ul className="space-y-2 text-sm">
                                {LEGAL_LINKS.map(({ label, to, url }) => (
                                    <li key={label}>
                                        {to ? (
                                            <Link
                                                to={to}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={url}
                                                className="text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-1 py-0.5 inline-block"
                                            >
                                                {label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="mt-6 pt-4 border-t border-gray-700 md:border-0">
                            <p className="text-xs text-gray-500">
                                <strong>Need Help?</strong>
                            </p>
                            <a
                                href="mailto:mponelaacton@gmail.com"
                                className="text-xs text-gray-400 hover:text-accent transition-colors"
                            >
                                mponelaacton@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-8 border-t border-gray-700" />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="text-xs text-gray-500">
                        &copy; {currentYear} Malawi Business Connector. All rights reserved. | Available in all 28 districts of Malawi.
                    </div>
                    <div className="text-xs text-gray-500 md:text-right">
                        Made for buying &amp; selling across Malawi 🇲🇼
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
