import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useAppContext } from '../contexts/AppContext';
import { loginUser, registerUser } from '../api/auth';

export default function SellerLogin({ onLoginSuccess, isSignup = false }) {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    ownerName: '',
    phone: '',
    town: '',
    category: '',
    description: '',
    profilePicture: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const towns = [
    'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu',
    'Salima', 'Mangochi', 'Dedza', 'Ntcheu', 'Karonga',
    'Rumphi', 'Mzimba', 'Nkhata Bay', 'Chitipa', 'Mulanje',
    'Thyolo', 'Chiradzulu', 'Machinga', 'Balaka', 'Chikwawa',
    'Nsanje', 'Neno', 'Phalombe', 'Dowa', 'Nkhotakota',
    'Liwonde', 'Likoma'
  ];

  const categories = [
    'Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden',
    'Health & Beauty', 'Sports & Outdoors', 'Books & Media', 'Automotive'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePictureChange = (imageData) => {
    setFormData({
      ...formData,
      profilePicture: imageData
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignup) {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return;
      }
      if (!formData.ownerName.trim()) {
        setError('Owner name is required');
        return;
      }
      if (!formData.phone.trim()) {
        setError('Phone number is required');
        return;
      }
      if (!formData.town) {
        setError('Please select your location');
        return;
      }
      if (!formData.category) {
        setError('Please select your business category');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isSignup) {
        const user = await registerUser(
          formData.ownerName || formData.businessName,
          formData.email,
          formData.password,
          'SELLER',
          {
            businessName: formData.businessName,
            phone: formData.phone,
            profilePicture: formData.profilePicture,
          }
        );
        setSuccess('Account created! Awaiting admin approval.');
        setUser(user);
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        const user = await loginUser(formData.email, formData.password);
        setSuccess('Login successful!');
        setUser(user);
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
      navigate('/seller-dashboard');
    } catch (err) {
      const message = err?.message || 'Failed to authenticate';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Store className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary mb-2">
            {isSignup ? 'Start Selling' : 'Seller Login'}
          </h1>
          <p className="text-gray-600">
            {isSignup ? 'Open your store on Tigulane' : 'Manage your store'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your Store Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <ProfilePictureUpload
                  onImageChange={handleProfilePictureChange}
                  currentImage={formData.profilePicture}
                  label="Business Owner Profile Picture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+265 9XX XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="town"
                  value={formData.town}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select your town</option>
                  {towns.map(town => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="business@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-6"
          >
            {isSignup ? 'Create Store' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignup ? (
            <>
              Already have a store?{' '}
              <a href="/seller-login" className="text-accent hover:underline font-bold">
                Login here
              </a>
            </>
          ) : (
            <>
              Don't have a store?{' '}
              <a href="/seller-signup" className="text-accent hover:underline font-bold">
                Sign up here
              </a>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-accent hover:underline text-sm font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
