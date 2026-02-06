import React, { useState, useEffect } from 'react';
import { DollarSign, Euro, TrendingUp, Coins } from 'lucide-react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import BaseTextInput from '../base/BaseTextInput';

const BudgetInput = ({ field, value, onChange, error }) => {
  const { name, label, number, required, placeholder } = field;

  // Parse existing value (e.g., "£12.5 million" or "£8M - £12M")
  const parseExistingValue = (val) => {
    if (!val) return { currency: '£', amount: '', maxAmount: '', notes: '' };

    // Detect currency
    let currency = '£';
    if (val.includes('$')) currency = '$';
    else if (val.includes('€')) currency = '€';

    // Remove currency symbols and clean up
    let cleanVal = val.replace(/[£$€]/g, '').trim();

    // Check for range (e.g., "8M - 12M" or "8 - 12 million")
    const rangeMatch = cleanVal.match(/(\d+\.?\d*)\s*[mM]?\s*-\s*(\d+\.?\d*)\s*[mM]?/);
    if (rangeMatch) {
      return {
        currency,
        amount: rangeMatch[1],
        maxAmount: rangeMatch[2],
        notes: ''
      };
    }

    // Single value (e.g., "12.5 million" or "12.5M")
    const singleMatch = cleanVal.match(/(\d+\.?\d*)/);
    if (singleMatch) {
      return {
        currency,
        amount: singleMatch[1],
        maxAmount: '',
        notes: ''
      };
    }

    return { currency: '£', amount: '', maxAmount: '', notes: val };
  };

  const [budget, setBudget] = useState(() => parseExistingValue(value));

  useEffect(() => {
    if (!value && budget.amount === '') {
      return;
    }
    if (value && !budget.amount) {
      const parsed = parseExistingValue(value);
      setBudget(parsed);
    }
  }, [value]);

  const formatNumber = (num) => {
    if (!num) return '';
    const number = parseFloat(num);
    if (isNaN(number)) return num;
    return number.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const generateFormattedText = (currency, amount, maxAmount, notes) => {
    if (!amount && !notes) return '';

    let text = currency;

    if (amount && maxAmount) {
      // Range format
      text += `${formatNumber(amount)}M - ${currency}${formatNumber(maxAmount)}M`;
    } else if (amount) {
      // Single value
      const num = parseFloat(amount);
      if (!isNaN(num)) {
        if (num >= 1) {
          text += `${formatNumber(amount)} million`;
        } else {
          text += `${formatNumber(num * 1000)}K`;
        }
      } else {
        text += amount;
      }
    }

    if (notes) {
      text += ` ${notes}`;
    }

    return text || notes;
  };

  const handleChange = (field, value) => {
    const newBudget = { ...budget, [field]: value };
    setBudget(newBudget);

    const formattedText = generateFormattedText(
      newBudget.currency,
      newBudget.amount,
      newBudget.maxAmount,
      newBudget.notes
    );

    onChange(name, formattedText);
  };

  const getCurrencyIcon = (curr) => {
    switch (curr) {
      case '$': return <DollarSign className="w-4 h-4" />;
      case '€': return <Euro className="w-4 h-4" />;
      case '£':
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const previewText = generateFormattedText(budget.currency, budget.amount, budget.maxAmount, budget.notes);

  return (
    <div className="space-y-3">
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      {/* Currency Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Currency
        </label>
        <div className="flex gap-2">
          {['£', '$', '€'].map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => handleChange('currency', curr)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                ${budget.currency === curr
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {getCurrencyIcon(curr)}
              <span className="text-sm font-medium">{curr === '£' ? 'GBP' : curr === '$' ? 'USD' : 'EUR'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {budget.maxAmount ? 'Minimum Budget (millions)' : 'Budget (millions)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {budget.currency}
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              value={budget.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 12.5"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              M
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Maximum Budget (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {budget.currency}
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              value={budget.maxAmount}
              onChange={(e) => handleChange('maxAmount', e.target.value)}
              className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 15.0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              M
            </span>
          </div>
        </div>
      </div>

      {/* Budget Range Indicator */}
      {budget.amount && budget.maxAmount && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Budget Range: {budget.currency}{formatNumber(budget.amount)}M - {budget.currency}{formatNumber(budget.maxAmount)}M
          </span>
        </div>
      )}

      {/* Validation */}
      {budget.amount && budget.maxAmount && parseFloat(budget.maxAmount) <= parseFloat(budget.amount) && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-700">
            Maximum budget should be greater than minimum budget
          </span>
        </div>
      )}

      {/* Optional Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Additional Notes (Optional)
        </label>
        <BaseTextInput
          type="text"
          value={budget.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="e.g., (excluding VAT), (provisional)"
        />
      </div>

      {/* Preview */}
      {previewText && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Preview (will appear in document):
          </label>
          <p className="text-sm font-medium text-gray-900">
            {previewText}
          </p>
        </div>
      )}

      {/* Placeholder hint when empty */}
      {!previewText && placeholder && (
        <div className="text-xs text-gray-500 italic">
          Example: {placeholder}
        </div>
      )}

      {/* Quick Presets */}
      {!budget.amount && (
        <div className="pt-2 border-t">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Quick presets:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '£5M', value: '5' },
              { label: '£10M', value: '10' },
              { label: '£25M', value: '25' },
              { label: '£50M', value: '50' },
              { label: '£100M', value: '100' }
            ].map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  handleChange('currency', '£');
                  handleChange('amount', preset.value);
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <FieldError error={error} className="text-red-600" />
    </div>
  );
};

export default BudgetInput;
