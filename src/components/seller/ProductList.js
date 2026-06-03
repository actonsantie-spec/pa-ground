import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../api/products';
import { getCurrentUser } from '../../api/apiClient';

const SellerProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const sellerId = currentUser?.seller?.id;

  useEffect(() => {
    if (!sellerId) return;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({ sellerId, perPage: 100 });
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [sellerId]);

  if (!sellerId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Seller access required</h2>
        <p className="text-gray-600">Please log in with a seller account to manage your products.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to delete product');
    }
  };

  const handleEdit = (id) => {
    navigate(`/seller/product/edit/${id}`);
  };

  const enrichedProducts = products.map((product) => ({
    ...product,
    status: product.stock > 0 ? 'active' : 'inactive',
    sales: product.sales || 0,
    image: product.images?.[0] || 'https://via.placeholder.com/120',
    categoryName: product.category?.name || 'Uncategorized',
    name: product.title || product.name,
  }));

  const filteredProducts = enrichedProducts.filter((product) => {
    const matchesFilter = filter === 'all' || product.status === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total Products', value: enrichedProducts.length, color: 'bg-blue-100 text-blue-900' },
    { label: 'Active Listings', value: enrichedProducts.filter((p) => p.status === 'active').length, color: 'bg-green-100 text-green-900' },
    { label: 'Out of Stock', value: enrichedProducts.filter((p) => p.stock === 0).length, color: 'bg-orange-100 text-orange-900' },
    { label: 'Total Sales', value: enrichedProducts.reduce((sum, p) => sum + (p.sales || 0), 0), color: 'bg-purple-100 text-purple-900' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600 mt-1">View and manage all your product listings</p>
        </div>
        <button
          onClick={() => navigate('/seller/product/new')}
          className="bg-accent text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-semibold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <div className="flex gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === option.value
                  ? 'bg-accent text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex gap-3 items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.categoryName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-accent">MK{Number(product.price).toLocaleString()}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{product.sales}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerProductList;
