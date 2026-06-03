import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { createProduct, fetchProductById, updateProduct } from '../../api/products';
import { getCurrentUser } from '../../api/apiClient';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const currentUser = getCurrentUser();
  const isSeller = currentUser?.role?.toLowerCase() === 'seller';

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    condition: 'New',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const categories = [
    'Phones & Accessories',
    'Electronics',
    'Clothes & Fashion',
    'Farming Products',
    'Building Materials',
    'Furniture',
    'Food & Groceries',
    'Services',
  ];

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const product = await fetchProductById(id);
        setFormData({
          name: product.title || '',
          category: product.category?.name || '',
          price: String(product.price || ''),
          stock: String(product.stock || ''),
          condition: 'New',
          description: product.description || '',
        });
        setImagePreview(product.images || []);
      } catch (err) {
        console.error(err);
        setSubmitError(err.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (!isSeller) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Seller access required</h2>
        <p className="text-gray-600 mb-4">Please log in with a seller account to add or edit products.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (imagePreview.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';
    if (!formData.stock || isNaN(Number(formData.stock))) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (imagePreview.length === 0) newErrors.images = 'At least one product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      title: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: imagePreview,
      categoryName: formData.category || undefined,
    };

    try {
      if (isEdit && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">Loading product...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., iPhone 12 Pro Max 256GB"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price (MK) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Product Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your product in detail..."
              rows="4"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            <p className="text-xs text-gray-600 mt-1">Minimum 20 characters recommended</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Product Images *</label>
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {imagePreview.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className={`flex items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
              errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-accent'
            }`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="font-semibold text-gray-900">Click to upload images</p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB. Maximum 5 images.</p>
                {imagePreview.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">{imagePreview.length} image(s) selected</p>
                )}
              </div>
            </label>
            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 font-bold py-3 rounded-lg transition-colors ${
                saving ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark text-white'
              }`}
            >
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
