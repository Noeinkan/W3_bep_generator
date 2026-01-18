import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import FieldHeader from '../base/FieldHeader';

/**
 * Dynamic matrix table that reads data from organizationalStructure (OrgStructureChart)
 * and displays Lead Appointed Parties with all their Appointed Parties
 */
const OrgStructureDataTable = ({ value, field, formData, exportMode = false }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Extract data from organizationalStructure as a matrix
  const tableData = useMemo(() => {
    const orgStructure = formData?.organizationalStructure;

    if (!orgStructure) return [];

    // Check if we have the tree structure
    const tree = orgStructure.tree || orgStructure;

    if (!tree || !tree.leadGroups) return [];

    // Map lead groups with their appointed parties
    return tree.leadGroups.map((lead, index) => ({
      id: lead.id || `lead_${index}`,
      leadAppointedParty: lead.name || '',
      role: lead.role || 'Lead Appointed Party',
      informationManager: lead.contact || '',
      appointedParties: (lead.children || []).map(child => ({
        id: child.id,
        name: child.name || '',
        role: child.role || 'Appointed Party',
        contact: child.contact || ''
      }))
    }));
  }, [formData?.organizationalStructure]);

  // In export mode, auto-expand all rows
  React.useEffect(() => {
    if (exportMode && tableData.length > 0) {
      setExpandedRows(new Set(tableData.map(row => row.id)));
    }
  }, [exportMode, tableData]);

  const toggleRow = (rowId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (expandedRows.size === tableData.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(tableData.map(row => row.id)));
    }
  };

  return (
    <div className="w-full max-w-full">
      <FieldHeader 
        fieldName={field.name}
        label={field.label}
        number={field.number}
        required={field.required}
      />
      
      <div className="mt-2 w-full">
        {tableData.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-700 text-sm">
              📊 This table will automatically populate when you add Lead Appointed Parties in the Organizational Structure diagram above.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {/* Header controls */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 rounded-lg border border-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">
                  {tableData.length} Lead Appointed {tableData.length === 1 ? 'Party' : 'Parties'}
                </span>
                <span className="text-xs text-gray-500">
                  • {tableData.reduce((sum, row) => sum + row.appointedParties.length, 0)} Total Appointed Parties
                </span>
              </div>
              {!exportMode && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {expandedRows.size === tableData.length ? 'Collapse All' : 'Expand All'}
                </button>
              )}
            </div>

            {/* Matrix rows */}
            <div className="w-full border border-gray-300 rounded-lg shadow-sm overflow-hidden">
              {tableData.map((row, index) => (
                <div key={row.id} className="border-b border-gray-200 last:border-b-0">
                  {/* Lead Appointed Party header row */}
                  <div
                    className={`bg-gradient-to-r from-indigo-50 to-blue-50 ${!exportMode ? 'hover:from-indigo-100 hover:to-blue-100 cursor-pointer' : ''} transition-colors ${
                      expandedRows.has(row.id) ? 'border-b border-gray-300' : ''
                    }`}
                    onClick={exportMode ? undefined : () => toggleRow(row.id)}
                  >
                    <div className="flex items-center px-4 py-3">
                      {/* Expand/Collapse icon */}
                      {!exportMode && (
                        <div className="flex-shrink-0 mr-3">
                          {expandedRows.has(row.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      )}
                      
                      {/* Number */}
                      <div className="flex-shrink-0 w-8 mr-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>

                      {/* Lead info grid */}
                      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Lead Appointed Party</div>
                          <div className="text-sm font-bold text-gray-900">{row.leadAppointedParty}</div>
                        </div>
                        <div className="col-span-3">
                          <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Role</div>
                          <div className="text-sm text-gray-700">{row.role}</div>
                        </div>
                        <div className="col-span-4">
                          <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Information Manager</div>
                          <div className="text-sm text-gray-700">
                            {row.informationManager || <span className="text-gray-400 italic">Not specified</span>}
                          </div>
                        </div>
                        <div className="col-span-1 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                            {row.appointedParties.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointed Parties matrix (expandable) */}
                  {expandedRows.has(row.id) && row.appointedParties.length > 0 && (
                    <div className="bg-white">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="w-16 px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              #
                            </th>
                            <th className="w-[40%] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              Appointed Party Name
                            </th>
                            <th className="w-[30%] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              Role/Discipline
                            </th>
                            <th className="w-[30%] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              Contact/Manager
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {row.appointedParties.map((party, partyIndex) => (
                            <tr key={party.id} className="hover:bg-blue-50 transition-colors">
                              <td className="w-16 px-4 py-3 text-sm text-gray-500 text-center">
                                {partyIndex + 1}
                              </td>
                              <td className="w-[40%] px-4 py-3 text-sm text-gray-900 font-medium">
                                {party.name}
                              </td>
                              <td className="w-[30%] px-4 py-3 text-sm text-gray-600">
                                {party.role}
                              </td>
                              <td className="w-[30%] px-4 py-3 text-sm text-gray-600">
                                {party.contact || <span className="text-gray-400 italic">Not specified</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Empty state for expanded row with no parties */}
                  {expandedRows.has(row.id) && row.appointedParties.length === 0 && (
                    <div className="bg-gray-50 px-4 py-6 text-center">
                      <p className="text-sm text-gray-500 italic">
                        No appointed parties assigned to this lead yet.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!exportMode && (
          <div className="mt-3 flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">📝 Auto-synced Matrix Data</p>
              <p className="text-xs">
                This matrix automatically reflects the organizational hierarchy with Lead Appointed Parties and their associated Appointed Parties
                defined in the <strong>Delivery Team's Organisational Structure and Composition</strong> diagram above.
                Click on any row to expand and view all appointed parties under each lead. Any changes made to the organizational chart will be instantly reflected here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgStructureDataTable;
