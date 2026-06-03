import React, { useState } from 'react';
import { Mail, Phone, Clock } from 'lucide-react';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log('Support form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">How can we help you today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-accent" size={24} />
                <h3 className="text-lg font-bold text-gray-900">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-2">Reach us via email</p>
              <a href="mailto:mponelaacton@gmail.com" className="text-accent hover:underline font-bold">
                mponelaacton@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="text-accent" size={24} />
                <h3 className="text-lg font-bold text-gray-900">WhatsApp Support</h3>
              </div>
              <p className="text-gray-600 mb-2">Message us on WhatsApp</p>
              <a href="https://wa.me/265XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">
                +265 XXX XXX XXX
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-accent" size={24} />
                <h3 className="text-lg font-bold text-gray-900">Response Time</h3>
              </div>
              <p className="text-gray-600">
                We typically respond within <strong>24 hours</strong> during business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-600">
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your issue..."
                  rows="5"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do I create an account?</h3>
              <p className="text-gray-600">Click "Buy Now" or "Become a Seller" on the homepage and fill in your details. For sellers, your account will be reviewed before approval.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">Yes, we use encrypted connections and follow industry best practices to protect your personal and payment information.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How long does delivery take?</h3>
              <p className="text-gray-600">Delivery times vary by location and seller. Most deliveries within Lilongwe take 1-2 days, while other areas may take 3-5 days.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I return items?</h3>
              <p className="text-gray-600">Yes, items can be returned within 7 days if they arrive damaged or don't match the description. Contact the seller first.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept mobile money (Airtel Money, MTN Mobile Money), bank transfers, and cash on delivery for selected locations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
