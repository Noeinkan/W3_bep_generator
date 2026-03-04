import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import apiService from '../../../services/apiService';
import { IFC_ENTITY_OPTIONS, IFC_DATA_TYPES, suggestIfcEntity } from '../../../constants/idsEntities';
import toast from 'react-hot-toast';

/**
 * Modal to edit IDS-related data for a LOIN row: IFC entity and property requirements.
 * On close calls onSaved() so parent can refresh.
 */
const LoinPropertyRequirementsModal = ({ row, onClose, onSaved }) => {
  const [ifcEntity, setIfcEntity] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingEntity, setSavingEntity] = useState(false);
  const [newProp, setNewProp] = useState(null); // { propertySet, propertyName, dataType, valueConstraint } when adding
  const [editing, setEditing] = useState(null); // { id, propertySet, propertyName, dataType, valueConstraint }

  const loadProperties = useCallback(async () => {
    if (!row?.id) return;
    setLoading(true);
    try {
      const res = await apiService.getLoinPropertyRequirements(row.id);
      setProperties(res?.data ?? []);
    } catch {
      toast.error('Failed to load property requirements');
    } finally {
      setLoading(false);
    }
  }, [row?.id]);

  useEffect(() => {
    if (!row) return;
    const suggested = row.ifc_entity?.trim() || suggestIfcEntity(row.element) || '';
    setIfcEntity(suggested);
    setNewProp(null);
    setEditing(null);
    loadProperties();
  }, [row, loadProperties]);

  const handleSaveIfcEntity = async () => {
    if (!row?.id) return;
    setSavingEntity(true);
    try {
      await apiService.updateLoinRow(row.id, { ...row, ifc_entity: ifcEntity.trim() || null });
      toast.success('IFC entity updated');
      onSaved?.();
    } catch {
      toast.error('Failed to update IFC entity');
    } finally {
      setSavingEntity(false);
    }
  };

  const handleAddProperty = () => {
    setNewProp({
      propertySet: '',
      propertyName: '',
      dataType: 'IFCLABEL',
      valueConstraint: '',
    });
  };

  const handleCreateProperty = async () => {
    if (!row?.id || !newProp) return;
    if (!newProp.propertySet?.trim() || !newProp.propertyName?.trim()) {
      toast.error('Property set and property name are required');
      return;
    }
    try {
      await apiService.createLoinPropertyRequirement(row.id, {
        propertySet: newProp.propertySet.trim(),
        propertyName: newProp.propertyName.trim(),
        dataType: newProp.dataType || 'IFCLABEL',
        valueConstraint: newProp.valueConstraint?.trim() || null,
      });
      toast.success('Property added');
      setNewProp(null);
      loadProperties();
      onSaved?.();
    } catch {
      toast.error('Failed to add property');
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      await apiService.updateLoinPropertyRequirement(editing.id, {
        propertySet: editing.propertySet,
        propertyName: editing.propertyName,
        dataType: editing.dataType,
        valueConstraint: editing.valueConstraint?.trim() || null,
      });
      toast.success('Property updated');
      setEditing(null);
      loadProperties();
      onSaved?.();
    } catch {
      toast.error('Failed to update property');
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await apiService.deleteLoinPropertyRequirement(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property removed');
      onSaved?.();
    } catch {
      toast.error('Failed to delete property');
    }
  };

  if (!row) return null;

  const title = `${row.discipline || ''} | ${row.stage || ''} | ${row.element || ''}`.trim() || 'LOIN row';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">IDS Properties — {title}</h2>
          <button type="button" onClick={() => { onSaved?.(); onClose(); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* IFC Entity */}
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">IFC Entity</label>
              <input
                type="text"
                list="ids-entity-list"
                value={ifcEntity}
                onChange={e => setIfcEntity(e.target.value)}
                placeholder="e.g. IFCWALL, IFCSLAB"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <datalist id="ids-entity-list">
                {IFC_ENTITY_OPTIONS.map(opt => <option key={opt} value={opt} />)}
              </datalist>
            </div>
            <button
              type="button"
              onClick={handleSaveIfcEntity}
              disabled={savingEntity}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {savingEntity ? 'Saving…' : 'Update row'}
            </button>
          </div>

          {/* Property requirements table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Property requirements</span>
              {!newProp && (
                <button
                  type="button"
                  onClick={handleAddProperty}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-teal-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase">Property Set</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase">Property Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase">Data Type</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase">Value Constraint</th>
                      <th className="px-3 py-2 w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {properties.map(pr => (
                      <tr key={pr.id}>
                        {editing?.id === pr.id ? (
                          <>
                            <td className="px-3 py-2"><input className="w-full px-2 py-1 text-sm border rounded" value={editing.propertySet} onChange={e => setEditing(s => ({ ...s, propertySet: e.target.value }))} /></td>
                            <td className="px-3 py-2"><input className="w-full px-2 py-1 text-sm border rounded" value={editing.propertyName} onChange={e => setEditing(s => ({ ...s, propertyName: e.target.value }))} /></td>
                            <td className="px-3 py-2">
                              <select className="w-full px-2 py-1 text-sm border rounded" value={editing.dataType} onChange={e => setEditing(s => ({ ...s, dataType: e.target.value }))}>
                                {IFC_DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </td>
                            <td className="px-3 py-2"><input className="w-full px-2 py-1 text-sm border rounded" value={editing.valueConstraint || ''} onChange={e => setEditing(s => ({ ...s, valueConstraint: e.target.value }))} /></td>
                            <td className="px-3 py-2">
                              <button type="button" onClick={handleSaveEdit} className="text-teal-600 text-sm font-medium">Save</button>
                              <button type="button" onClick={() => setEditing(null)} className="text-gray-500 text-sm ml-1">Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 text-sm text-gray-700">{pr.property_set}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{pr.property_name}</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{pr.data_type}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{pr.value_constraint || '—'}</td>
                            <td className="px-3 py-2">
                              <button type="button" onClick={() => setEditing({ id: pr.id, propertySet: pr.property_set, propertyName: pr.property_name, dataType: pr.data_type, valueConstraint: pr.value_constraint || '' })} className="text-gray-500 hover:text-teal-600 text-xs mr-1">Edit</button>
                              <button type="button" onClick={() => handleDeleteProperty(pr.id)} className="p-1 text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {newProp && (
                      <tr className="bg-teal-50/50">
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="e.g. Pset_WallCommon"
                            value={newProp.propertySet}
                            onChange={e => setNewProp(p => ({ ...p, propertySet: e.target.value }))}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="e.g. FireRating"
                            value={newProp.propertyName}
                            onChange={e => setNewProp(p => ({ ...p, propertyName: e.target.value }))}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded" value={newProp.dataType} onChange={e => setNewProp(p => ({ ...p, dataType: e.target.value }))}>
                            {IFC_DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="e.g. REI 60"
                            value={newProp.valueConstraint}
                            onChange={e => setNewProp(p => ({ ...p, valueConstraint: e.target.value }))}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={handleCreateProperty} className="text-teal-600 text-sm font-medium">Add</button>
                          <button type="button" onClick={() => setNewProp(null)} className="text-gray-500 text-sm ml-1">Cancel</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button type="button" onClick={() => { onSaved?.(); onClose(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoinPropertyRequirementsModal;
