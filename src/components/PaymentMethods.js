import React, { useState } from 'react';
import { CreditCard, Smartphone, AlertCircle, Copy, Check } from 'lucide-react';

const PaymentMethods = () => {
  // Local payment methods available in Malawi
  const paymentMethods = {
    mobileMoney: [
      {
        id: 'airtel-money',
        name: 'Airtel Money',
        shortCode: '*150#',
        icon: '📱',
        color: 'bg-red-50 border-red-200',
        description: 'Send money via Airtel mobile money',
        instructions: [
          'Dial *150# on your Airtel SIM',
          'Select "Send Money"',
          'Enter the seller\'s phone number',
          'Enter the amount',
          'Complete the transaction'
        ]
      },
      {
        id: 'tnm-mpamba',
        name: 'TNM Mpamba',
        shortCode: '*165#',
        icon: '📱',
        color: 'bg-yellow-50 border-yellow-200',
        description: 'Send money via TNM mobile money',
        instructions: [
          'Dial *165# on your TNM SIM',
          'Select "Send Money"',
          'Enter the seller\'s phone number',
          'Enter the amount',
          'Complete the transaction'
        ]
      },
      {
        id: 'mtc-money',
        name: 'MTC Money',
        shortCode: '*105#',
        icon: '📱',
        color: 'bg-blue-50 border-blue-200',
        description: 'Send money via Malawi Telecom',
        instructions: [
          'Dial *105# on your Malawi Telecom SIM',
          'Select "Send Money"',
          'Enter the seller\'s phone number',
          'Enter the amount',
          'Complete the transaction'
        ]
      }
    ],
    banks: [
      {
        id: 'fnb-malawi',
        name: 'First National Bank (FNB)',
        icon: '🏦',
        color: 'bg-green-50 border-green-200',
        description: 'Bank transfer via FNB',
        instructions: [
          'Ask the seller for their FNB account details',
          'Use your online banking or visit FNB',
          'Transfer the exact amount to the seller\'s account',
          'Share the transaction reference with the seller'
        ]
      },
      {
        id: 'stanbic-malawi',
        name: 'Stanbic Bank',
        icon: '🏦',
        color: 'bg-purple-50 border-purple-200',
        description: 'Bank transfer via Stanbic',
        instructions: [
          'Ask the seller for their Stanbic account details',
          'Use your online banking or visit a branch',
          'Transfer the exact amount to the seller\'s account',
          'Share the transaction reference with the seller'
        ]
      },
      {
        id: 'nbc-malawi',
        name: 'National Bank of Malawi (NBM)',
        icon: '🏦',
        color: 'bg-indigo-50 border-indigo-200',
        description: 'Bank transfer via NBM',
        instructions: [
          'Ask the seller for their NBM account details',
          'Use your online banking or visit a branch',
          'Transfer the exact amount to the seller\'s account',
          'Share the transaction reference with the seller'
        ]
      },
      {
        id: 'standard-bank',
        name: 'Standard Bank',
        icon: '🏦',
        color: 'bg-orange-50 border-orange-200',
        description: 'Bank transfer via Standard Bank',
        instructions: [
          'Ask the seller for their Standard Bank account details',
          'Use your online banking or visit a branch',
          'Transfer the exact amount to the seller\'s account',
          'Share the transaction reference with the seller'
        ]
      }
    ],
    cashPayment: [
      {
        id: 'cash-on-delivery',
        name: 'Cash on Delivery',
        icon: '💵',
        color: 'bg-gray-50 border-gray-200',
        description: 'Pay the seller when they deliver',
        instructions: [
          'Have the exact amount ready in cash',
          'Verify the products when the seller arrives',
          'Pay the seller directly',
          'Get a receipt if needed'
        ]
      }
    ]
  };

  const [selectedMethod, setSelectedMethod] = useState('cash-on-delivery');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PaymentCard = ({ method, category }) => {
    const isSelected = selectedMethod === method.id;
    const isExpanded = expandedId === method.id;

    return (
      <div
        key={method.id}
        className={`rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? 'border-accent bg-accent bg-opacity-5'
            : method.color
        }`}
        onClick={() => setSelectedMethod(method.id)}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">{method.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => setSelectedMethod(method.id)}
                  className="cursor-pointer"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>

              {method.shortCode && (
                <div className="mt-3 flex items-center gap-2 bg-white bg-opacity-60 px-3 py-2 rounded">
                  <code className="font-mono font-bold text-accent">{method.shortCode}</code>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(method.shortCode, method.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copiedId === method.id ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {isSelected && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedId(isExpanded ? null : method.id);
              }}
              className="mt-3 text-sm text-accent hover:underline font-semibold"
            >
              {isExpanded ? 'Hide Instructions' : 'View Instructions'}
            </button>
          )}
        </div>

        {isExpanded && isSelected && (
          <div className="bg-white bg-opacity-50 border-t border-gray-200 px-4 py-3 space-y-3">
            <div>
              <h5 className="font-bold text-gray-900 mb-2 text-sm">How to pay:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {method.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 flex gap-2 text-sm text-blue-900">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>
                After you place your order, the seller will contact you via WhatsApp or phone to confirm payment details and arrange delivery.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h3>
        <p className="text-gray-600 text-sm mb-6">
          Choose how you'd like to pay. The seller will contact you to confirm payment details.
        </p>
      </div>

      {/* Cash on Delivery */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">💵</span> Pay on Delivery
        </h4>
        <div className="space-y-3">
          {paymentMethods.cashPayment.map(method => (
            <PaymentCard key={method.id} method={method} category="cash" />
          ))}
        </div>
      </div>

      {/* Mobile Money */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Smartphone size={24} className="text-accent" /> Mobile Money
        </h4>
        <div className="space-y-3">
          {paymentMethods.mobileMoney.map(method => (
            <PaymentCard key={method.id} method={method} category="mobile" />
          ))}
        </div>
      </div>

      {/* Bank Transfers */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CreditCard size={24} className="text-accent" /> Bank Transfer
        </h4>
        <div className="space-y-3">
          {paymentMethods.banks.map(method => (
            <PaymentCard key={method.id} method={method} category="bank" />
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 space-y-2">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-yellow-700 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-900">Important Information</p>
            <p className="text-sm text-yellow-800 mt-1">
              Most transactions in Malawi happen directly between buyers and sellers through WhatsApp or phone calls. The seller will provide their specific payment account details or confirm your preferred payment method after you place the order. Never send payment to anyone claiming to be from "Malawi Business Connector" - always verify directly with the seller.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Method Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Selected Payment Method:</p>
        <p className="font-bold text-gray-900">
          {paymentMethods.mobileMoney.find(m => m.id === selectedMethod)?.name ||
            paymentMethods.banks.find(m => m.id === selectedMethod)?.name ||
            paymentMethods.cashPayment.find(m => m.id === selectedMethod)?.name}
        </p>
      </div>

      {/* Hidden input to pass selected method to parent */}
      <input
        type="hidden"
        name="paymentMethod"
        value={selectedMethod}
      />
    </div>
  );
};

export default PaymentMethods;
