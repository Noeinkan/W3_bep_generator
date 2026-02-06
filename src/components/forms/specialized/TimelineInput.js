import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import BaseTextInput from '../base/BaseTextInput';

const CustomDatePicker = ({ value, onChange, label, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[0]);
    }
    return new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[1]);
    }
    return null;
  });

  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const months = [
    { num: 1, name: 'Jan', full: 'January' },
    { num: 2, name: 'Feb', full: 'February' },
    { num: 3, name: 'Mar', full: 'March' },
    { num: 4, name: 'Apr', full: 'April' },
    { num: 5, name: 'May', full: 'May' },
    { num: 6, name: 'Jun', full: 'June' },
    { num: 7, name: 'Jul', full: 'July' },
    { num: 8, name: 'Aug', full: 'August' },
    { num: 9, name: 'Sep', full: 'September' },
    { num: 10, name: 'Oct', full: 'October' },
    { num: 11, name: 'Nov', full: 'November' },
    { num: 12, name: 'Dec', full: 'December' }
  ];

  const formatDisplayValue = () => {
    if (!value) return '';
    const [year, month] = value.split('-');
    const monthName = months[parseInt(month) - 1].full;
    return `${monthName} ${year}`;
  };

  const handleMonthSelect = (monthNum) => {
    setSelectedMonth(monthNum);
    const monthStr = monthNum.toString().padStart(2, '0');
    const newValue = `${selectedYear}-${monthStr}`;
    onChange(newValue);
    setShowPicker(false);
  };

  const handleYearChange = (delta) => {
    setSelectedYear(prev => prev + delta);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        <Calendar className="inline-block w-3 h-3 mr-1" />
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplayValue() || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-full min-w-[320px]">
          {/* Year Selector */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <button
              type="button"
              onClick={() => handleYearChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-24 px-3 py-2 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1900"
                max="2100"
              />
            </div>
            <button
              type="button"
              onClick={() => handleYearChange(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <button
                key={month.num}
                type="button"
                onClick={() => handleMonthSelect(month.num)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${selectedMonth === month.num && value?.startsWith(selectedYear.toString())
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
              >
                {month.name}
              </button>
            ))}
          </div>

          {/* Quick Year Selection */}
          <div className="mt-4 pt-3 border-t">
            <div className="text-xs font-medium text-gray-600 mb-2">Quick select:</div>
            <div className="flex gap-2">
              {[0, 1, 2].map(offset => {
                const year = new Date().getFullYear() + offset;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`
                      flex-1 px-3 py-2 text-xs rounded-lg transition-colors
                      ${selectedYear === year
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineInput = ({ field, value, onChange, error }) => {
  const { name, label, number, required, placeholder } = field;

  // Parse existing value if it exists (e.g., "24 months (Jan 2025 - Dec 2026)")
  const parseExistingValue = (val) => {
    if (!val) return { startDate: '', endDate: '', notes: '' };

    const dateMatch = val.match(/\(([^-]+)-([^)]+)\)/);
    if (dateMatch) {
      const start = dateMatch[1].trim();
      const end = dateMatch[2].trim();

      // Try to parse dates like "Jan 2025" or "January 2025"
      const startDate = parseDateString(start);
      const endDate = parseDateString(end);

      return {
        startDate: startDate || '',
        endDate: endDate || '',
        notes: ''
      };
    }

    return { startDate: '', endDate: '', notes: val };
  };

  const parseDateString = (str) => {
    const months = {
      'jan': '01', 'january': '01',
      'feb': '02', 'february': '02',
      'mar': '03', 'march': '03',
      'apr': '04', 'april': '04',
      'may': '05',
      'jun': '06', 'june': '06',
      'jul': '07', 'july': '07',
      'aug': '08', 'august': '08',
      'sep': '09', 'september': '09',
      'oct': '10', 'october': '10',
      'nov': '11', 'november': '11',
      'dec': '12', 'december': '12'
    };

    const parts = str.trim().toLowerCase().split(' ');
    if (parts.length === 2) {
      const month = months[parts[0]];
      const year = parts[1];
      if (month && year.length === 4) {
        return `${year}-${month}`;
      }
    }

    return null;
  };

  const [timeline, setTimeline] = useState(() => parseExistingValue(value));

  useEffect(() => {
    if (!value && timeline.startDate === '' && timeline.endDate === '') {
      return;
    }
    if (value && !timeline.startDate && !timeline.endDate) {
      const parsed = parseExistingValue(value);
      setTimeline(parsed);
    }
  }, [value]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;

    const [startYear, startMonth] = start.split('-').map(Number);
    const [endYear, endMonth] = end.split('-').map(Number);

    const months = (endYear - startYear) * 12 + (endMonth - startMonth);

    if (months <= 0) return null;

    return months;
  };

  const generateFormattedText = (start, end, notes) => {
    if (!start && !end) return notes || '';

    const duration = calculateDuration(start, end);
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);

    if (start && end && duration) {
      let text = `${duration} month${duration !== 1 ? 's' : ''} (${startFormatted} - ${endFormatted})`;
      if (notes) {
        text += ` - ${notes}`;
      }
      return text;
    } else if (start && end) {
      let text = `${startFormatted} - ${endFormatted}`;
      if (notes) {
        text += ` - ${notes}`;
      }
      return text;
    } else if (notes) {
      return notes;
    }

    return '';
  };

  const handleChange = (field, value) => {
    const newTimeline = { ...timeline, [field]: value };
    setTimeline(newTimeline);

    const formattedText = generateFormattedText(
      newTimeline.startDate,
      newTimeline.endDate,
      newTimeline.notes
    );

    onChange(name, formattedText);
  };

  const duration = calculateDuration(timeline.startDate, timeline.endDate);
  const previewText = generateFormattedText(timeline.startDate, timeline.endDate, timeline.notes);

  return (
    <div className="space-y-3">
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <CustomDatePicker
          value={timeline.startDate}
          onChange={(val) => handleChange('startDate', val)}
          label="Start Date"
          placeholder="Select start month"
        />

        {/* End Date */}
        <CustomDatePicker
          value={timeline.endDate}
          onChange={(val) => handleChange('endDate', val)}
          label="End Date"
          placeholder="Select end month"
        />
      </div>

      {/* Duration Display */}
      {duration !== null && duration > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Duration: {duration} month{duration !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {duration !== null && duration <= 0 && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-700">
            End date must be after start date
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
          value={timeline.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="e.g., Including 2-month contingency"
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

      <FieldError error={error} className="text-red-600" />
    </div>
  );
};

export default TimelineInput;
