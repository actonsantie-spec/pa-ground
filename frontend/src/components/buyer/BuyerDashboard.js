import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Edit2, User, LogOut } from 'lucide-react';
import ProfilePictureUpload from '../ProfilePictureUpload';

const BuyerDashboard = ({ onLogout = () => {} }) => {
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'buyer') {
      setBuyerProfile(currentUser);
    }
  }, []);

  const handleProfilePictureChange = (imageData) => {
    if (buyerProfile) {
      const updatedProfile = {
        ...buyerProfile,
        profilePicture: imageData
      };
      setBuyerProfile(updatedProfile);
      localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
      localStorage.setItem(`buyer_${updatedProfile.email}`, JSON.stringify(updatedProfile));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
  };

  if (!buyerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Active Orders', value: '2', icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Wishlist Items', value: '8', icon: Heart, color: 'text-red-600' },
    { label: 'Past Orders', value: '15', icon: ShoppingBag, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">

      {/* Profile Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary-light rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between gap-6">

          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg bg-white bg-opacity-20 flex items-center justify-center overflow-hidden border-2 border-white border-opacity-30">
              {buyerProfile.profilePicture ? (
                <img
                  src={buyerProfile.profilePicture}
                  alt={buyerProfile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-white opacity-60" />
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{buyerProfile.fullName}</h2>
            <p className="text-white text-opacity-90">{buyerProfile.email}</p>
            <p className="text-white text-opacity-80 text-sm mt-1">
              📞 {buyerProfile.phone || 'Not provided'}
            </p>
            <div className="mt-3 text-sm text-white text-opacity-90">
              <p>Member since {new Date(buyerProfile.registeredAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="bg-white text-secondary hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Edit2 size={18} />
              {isEditingProfile ? 'Done' : 'Edit'}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Edit Section */}
        {isEditingProfile && (
          <div className="mt-6 border-t border-white border-opacity-30 pt-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 space-y-4">

              <h3 className="font-bold mb-4">Update Your Profile</h3>

              <ProfilePictureUpload
                onImageChange={handleProfilePictureChange}
                currentImage={buyerProfile.profilePicture}
                label="Your Profile Picture"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={buyerProfile.fullName}
                    className="w-full border border-white border-opacity-30 rounded-lg px-4 py-2 bg-white bg-opacity-10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={buyerProfile.email}
                    className="w-full border border-white border-opacity-30 rounded-lg px-4 py-2 bg-white bg-opacity-10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={buyerProfile.phone}
                    className="w-full border border-white border-opacity-30 rounded-lg px-4 py-2 bg-white bg-opacity-10 text-white"
                  />
                </div>
              </div>

              <button className="bg-white text-secondary hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Shopping Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your orders and manage your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/search" className="bg-accent text-white rounded-lg p-6">
          Continue Shopping
        </a>

        <a href="/orders" className="bg-blue-600 text-white rounded-lg p-6">
          Track Orders
        </a>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
        No recent activity yet.
      </div>
    </div>
  );
};

export default BuyerDashboard;