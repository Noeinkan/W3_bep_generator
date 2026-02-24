import { useState, useRef, useCallback } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';
import useOutsideClick from '../../../hooks/useOutsideClick';

const SearchableSelect = ({ id, name, value, onChange, options = [], placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  useOutsideClick(containerRef, close, isOpen);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showCustom = searchTerm.trim() &&
    !options.some(o => o.toLowerCase() === searchTerm.trim().toLowerCase());

  const select = (val) => {
    onChange(name, val);
    close();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(o => !o)}
        className="w-full p-3 border rounded-lg text-left flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className={value ? 'text-gray-900 text-sm' : 'text-gray-400 text-sm'}>
          {value || placeholder || 'Select option'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') close();
                  if (e.key === 'Enter' && filtered.length > 0) select(filtered[0]);
                }}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => select(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    value === option
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : !showCustom ? (
              <p className="px-4 py-3 text-sm text-gray-400">No results found</p>
            ) : null}

            {showCustom && (
              <button
                type="button"
                onClick={() => select(searchTerm.trim())}
                className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                Use &quot;{searchTerm.trim()}&quot;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
