import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Check, X } from 'lucide-react';

const PaymentMethodsAdmin = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'mobile', // 'mobile', 'bank', 'cash'
    description: '',
    shortCode: '',
    isActive: true,
    icon: '📱'
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = () => {
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      setPaymentMethods(JSON.parse(stored));
    } else {
      // Initialize with default methods
      const defaults = [
        {
          id: 'cash-on-delivery',
          name: 'Cash on Delivery',
          category: 'cash',
          description: 'Pay the seller when they deliver',
          shortCode: '',
          isActive: true,
          icon: '💵'
        },
        {
          id: 'airtel-money',
          name: 'Airtel Money',
          category: 'mobile',
          description: 'Send money via Airtel mobile money',
          shortCode: '*150#',
          isActive: true,
          icon: '📱'
        },
        {
          id: 'tnm-mpamba',
          name: 'TNM Mpamba',
          category: 'mobile',
          description: 'Send money via TNM mobile money',
          shortCode: '*165#',
          isActive: true,
          icon: '📱'
        },
        {
          id: 'mtc-money',
          name: 'MTC Money',
          category: 'mobile',
          description: 'Send money via Malawi Telecom',
          shortCode: '*105#',
          isActive: true,
          icon: '📱'
        },
        {
          id: 'fnb-malawi',
          name: 'First National Bank (FNB)',
          category: 'bank',
          description: 'Bank transfer via FNB',
          shortCode: '',
          isActive: true,
          icon: '🏦'
        },
        {
          id: 'stanbic-malawi',
          name: 'Stanbic Bank',
          category: 'bank',
          description: 'Bank transfer via Stanbic',
          shortCode: '',
          isActive: true,
          icon: '🏦'
        },
      ];
      setPaymentMethods(defaults);
      localStorage.setItem('paymentMethods', JSON.stringify(defaults));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setPaymentMethods(prev =>
        prev.map(method =>
          method.id === editingId ? { ...formData, id: editingId } : method
        )
      );
    } else {
      const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
      setPaymentMethods(prev => [...prev, { ...formData, id: newId }]);
    }

    localStorage.setItem(
      'paymentMethods',
      JSON.stringify(
        editingId
          ? paymentMethods.map(m => (m.id === editingId ? { ...formData, id: editingId } : m))
          : [...paymentMethods, { ...formData, id: formData.name.toLowerCase().replace(/\s+/g, '-') }]
      )
    );

    resetForm();
  };

  const handleEdit = (method) => {
    setFormData(method);
    setEditingId(method.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      const updated = paymentMethods.filter(m => m.id !== id);
      setPaymentMethods(updated);
      localStorage.setItem('paymentMethods', JSON.stringify(updated));
    }
  };

  const handleToggleActive = (id) => {
    const updated = paymentMethods.map(m =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    setPaymentMethods(updated);
    localStorage.setItem('paymentMethods', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: 'mobile',
      description: '',
      shortCode: '',
      isActive: true,
      icon: '📱'
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const categoryLabels = {
    mobile: 'Mobile Money',
    bank: 'Bank Transfer',
    cash: 'Cash Payment'
  };

  const categoryColors = {
    mobile: 'bg-red-50 text-red-700 border-red-200',
    bank: 'bg-green-50 text-green-700 border-green-200',
    cash: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-1">Manage payment methods available for buyers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          Add Payment Method
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Method Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Airtel Money"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="mobile">Mobile Money</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                maxLength="2"
                placeholder="📱"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-center text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Short Code (if applicable)
              </label>
              <input
                type="text"
                name="shortCode"
                value={formData.shortCode}
                onChange={handleInputChange}
                placeholder="e.g., *150#"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this payment method..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-gray-900">Active (visible to buyers)</label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              className="flex-1 bg-accent hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
            >
              Save Method
            </button>
            <button
              onClick={resetForm}
              className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-3">
        {['cash', 'mobile', 'bank'].map(category => {
          const methods = paymentMethods.filter(m => m.category === category);
          if (methods.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {categoryLabels[category]}
              </h3>
              <div className="space-y-2">
                {methods.map(method => (
                  <div
                    key={method.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{method.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        {method.shortCode && (
                          <p className="text-sm text-accent font-mono font-bold mt-1">
                            {method.shortCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[category]}`}
                      >
                        {categoryLabels[category]}
                      </span>

                      <button
                        onClick={() => handleToggleActive(method.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          method.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                        title={method.isActive ? 'Active' : 'Inactive'}
                      >
                        {method.isActive ? <Check size={20} /> : <X size={20} />}
                      </button>

                      <button
                        onClick={() => handleEdit(method)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {paymentMethods.length === 0 && !isAdding && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle size={40} className="text-yellow-700 mx-auto mb-3" />
          <p className="text-gray-900 font-semibold">No payment methods available</p>
          <p className="text-gray-600 text-sm mt-1">Add payment methods to enable checkout</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-blue-700 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Payment Methods Management</p>
            <p className="mt-1">
              These payment methods will be displayed to buyers during checkout. You can enable/disable any method, and add new payment options based on local availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsAdmin;
