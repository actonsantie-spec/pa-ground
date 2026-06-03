import React, { useState, useEffect } from 'react';
import { Edit2, LogOut, User, Phone, Mail } from 'lucide-react';
import ProfilePictureUpload from '../ProfilePictureUpload';

const BuyerProfile = ({ onLogout = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Load buyer profile from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'buyer') {
      setProfile(currentUser);
      setFormData(currentUser);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: imageData
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    localStorage.setItem('currentUser', JSON.stringify(formData));
    localStorage.setItem(`buyer_${formData.email}`, JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
  };

  if (!profile || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Edit2 size={20} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {isEditing ? (
        // Edit Mode
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Profile Picture Upload */}
          <div>
            <ProfilePictureUpload
              onImageChange={handleProfilePictureChange}
              currentImage={formData.profilePicture}
              label="Your Profile Picture"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-accent hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
              <p className="text-gray-600 mt-1">Buyer Account</p>
              <p className="text-sm text-gray-500 mt-2">
                Registered: {new Date(profile.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="text-accent" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Email Address</p>
                <p className="text-gray-900 font-semibold">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-accent" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="text-gray-900 font-semibold">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
