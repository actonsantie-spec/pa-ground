import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ sellerName = 'Seller', productName = 'Product', phoneNumber = '' }) => {
    const message = encodeURIComponent(
        `Hello ${sellerName}, I saw your "${productName}" on Malawi Business Connector app. Is it still available?`
    );

    const whatsappLink = phoneNumber
        ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`
        : '#';

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <MessageCircle size={20} />
            <span className="hidden sm:inline">Chat on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
        </a>
    );
};

export default WhatsAppButton;
