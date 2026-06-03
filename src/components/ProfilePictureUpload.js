import React, { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';

const ProfilePictureUpload = ({ onImageChange, currentImage, label = 'Profile Picture' }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Convert to base64 and set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-4">
        {/* Preview or Placeholder */}
        <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <div className="text-center">
              <User size={40} className="text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No image</p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Upload size={18} />
            Upload Photo
          </button>
          <p className="text-xs text-gray-500">
            JPG, PNG, GIF (Max 5MB)
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile picture"
      />

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
