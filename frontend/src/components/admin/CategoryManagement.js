import React, { useState } from 'react';
import { Plus, Edit2, Trash2} from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Phones & Accessories', description: 'Mobile phones and related accessories', listings: 234, status: 'active' },
        { id: 2, name: 'Electronics', description: 'Laptops, tablets, and other electronics', listings: 156, status: 'active' },
        { id: 3, name: 'Clothes & Fashion', description: 'Clothing, footwear, and fashion items', listings: 342, status: 'active' },
        { id: 4, name: 'Farming Products', description: 'Seeds, tools, and agricultural products', listings: 89, status: 'active' },
        { id: 5, name: 'Building Materials', description: 'Construction materials and supplies', listings: 127, status: 'active' },
        { id: 6, name: 'Furniture', description: 'Furniture and home furnishings', listings: 98, status: 'active' },
        { id: 7, name: 'Food & Groceries', description: 'Food items and grocery products', listings: 456, status: 'active' },
        { id: 8, name: 'Services', description: 'Professional services and repairs', listings: 203, status: 'active' },
    ]);

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleAddCategory = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        const newCategory = {
            id: Math.max(...categories.map(c => c.id)) + 1,
            name: formData.name,
            description: formData.description,
            listings: 0,
            status: 'active',
        };

        setCategories([...categories, newCategory]);
        setFormData({ name: '', description: '' });
        setIsAddingCategory(false);
    };

    const handleEditCategory = (id) => {
        const category = categories.find(c => c.id === id);
        setFormData({ name: category.name, description: category.description });
        setEditingId(id);
    };

    const handleUpdateCategory = (e) => {
        e.preventDefault();

        setCategories(categories.map(c =>
            c.id === editingId
                ? { ...c, name: formData.name, description: formData.description }
                : c
        ));

        setFormData({ name: '', description: '' });
        setEditingId(null);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleToggleStatus = (id) => {
        setCategories(categories.map(c =>
            c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Category Management</h1>
                    <p className="text-gray-600 mt-1">Manage product categories on the platform</p>
                </div>
                {!isAddingCategory && !editingId && (
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Categories', value: categories.length },
                    { label: 'Active', value: categories.filter(c => c.status === 'active').length },
                    { label: 'Total Listings', value: categories.reduce((sum, c) => sum + c.listings, 0) },
                    { label: 'Avg Listings/Category', value: Math.round(categories.reduce((sum, c) => sum + c.listings, 0) / categories.length) },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-accent">
                        <p className="text-2xl font-bold text-accent">{stat.value}</p>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Add/Edit Form */}
            {(isAddingCategory || editingId) && (
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h3 className="text-lg font-bold text-secondary">
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h3>

                    <form onSubmit={editingId ? handleUpdateCategory : handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="e.g., Electronics"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Describe this category..."
                                rows="3"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-2 rounded-lg transition-colors"
                            >
                                {editingId ? 'Update Category' : 'Add Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingCategory(false);
                                    setEditingId(null);
                                    setFormData({ name: '', description: '' });
                                }}
                                className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-secondary to-accent border-b border-accent">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">Listings</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-secondary">{category.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">{category.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-secondary">{category.listings}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(category.id)}
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                                category.status === 'active'
                                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditCategory(category.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
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
            </div>
        </div>
    );
};

export default CategoryManagement;
