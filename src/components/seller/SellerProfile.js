import React, { useEffect, useState } from 'react';
import { Edit2, MapPin, Phone, MessageCircle, User } from 'lucide-react';
import ProfilePictureUpload from '../ProfilePictureUpload';
import { getCurrentUser } from '../../api/apiClient';

const SellerProfile = ({ onEdit = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role?.toLowerCase() === 'seller') {
      const sellerProfile = {
        fullName: user.name || '',
        businessName: user.seller?.businessName || '',
        phone: user.phone || '',
        whatsapp: user.phone || '',
        town: user.town || '',
        category: user.category || '',
        description: user.description || '',
        profilePicture: user.profilePicture || null,
      };
      setProfile(sellerProfile);
      setFormData(sellerProfile);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (imageData) => {
    setFormData((prev) => ({ ...prev, profilePicture: imageData }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    onEdit(formData);
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Seller profile unavailable</h2>
        <p className="text-gray-600">Please log in with your seller account to view profile details.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Business Name', value: profile.businessName || 'N/A' },
    { label: 'Owner', value: profile.fullName || 'N/A' },
    { label: 'Phone', value: profile.phone || 'N/A' },
    { label: 'Location', value: profile.town || 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Edit2 size={20} />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <ProfilePictureUpload
              onImageChange={handleProfilePictureChange}
              currentImage={formData.profilePicture}
              label="Business Owner Profile Picture"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">WhatsApp Number *</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Town/District</label>
              <input
                type="text"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Business Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              rows="4"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors">
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.businessName}</h2>
              <p className="text-gray-600 mt-1">Owned by: {profile.fullName}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><MapPin size={18} />{profile.town || 'No location set'}</p>
                <p className="flex items-center gap-2"><Phone size={18} />{profile.phone || 'No phone set'}</p>
                <p className="flex items-center gap-2"><MessageCircle size={18} />{profile.whatsapp || 'No WhatsApp number set'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-2">About This Business</h3>
            <p className="text-gray-600 leading-relaxed">{profile.description || 'No business description provided yet.'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
