import React from 'react';
import DOMPurify from 'dompurify';
import OrgStructureField from '../forms/specialized/OrgStructureField';
import OrgStructureDataTable from '../forms/specialized/OrgStructureDataTable';
import CDEPlatformEcosystem from '../forms/custom/CDEPlatformEcosystem';
import VolumeStrategyMindmap from '../forms/diagrams/diagram-components/VolumeStrategyMindmap';
import FolderStructureDiagram from '../forms/diagrams/diagram-components/FolderStructureDiagram';
import NamingConventionBuilder from '../forms/custom/NamingConventionBuilder';
import FederationStrategyBuilder from '../forms/custom/FederationStrategyBuilder';
import CONFIG from '../../config/bepConfig';

/**
 * BEP Preview Renderer - Displays BEP content with React components
 * Shows both regular fields and custom visual components
 */
const BepPreviewRenderer = ({ formData, bepType, tidpData = [], midpData = [] }) => {
  const noop = () => {}; // No-op onChange for preview mode

  const isLikelyHtml = (value) => typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value);

  const sanitizeRichText = (html) => DOMPurify.sanitize(html, {
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    ADD_ATTR: ['class', 'data-caption', 'target', 'rel']
  });

  const normalizeMilestoneRow = (row) => {
    if (!row || typeof row !== 'object') {
      return {
        'Stage/Phase': '',
        'Milestone Description': '',
        Deliverables: '',
        'Due Date': ''
      };
    }

    const getFirstValue = (keys) => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key];
        }
      }
      return '';
    };

    return {
      'Stage/Phase': getFirstValue(['Stage/Phase', 'Stage', 'Phase', 'stage', 'phase']),
      'Milestone Description': getFirstValue(['Milestone Description', 'milestoneDescription', 'Description', 'description']),
      Deliverables: getFirstValue(['Deliverables', 'deliverables']),
      'Due Date': getFirstValue(['Due Date', 'dueDate', 'Date', 'date'])
    };
  };

  const renderFieldValue = (field, value) => {
    if (!value) return null;

    // Handle custom visual components
    switch (field.type) {
      case 'orgchart':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="orgchart">
            <OrgStructureField
              field={field}
              value={value}
              onChange={noop}
              formData={formData}
              exportMode={true}
            />
          </div>
        );

      case 'orgstructure-data-table':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="orgstructure-data-table">
            <OrgStructureDataTable
              field={field}
              value={value}
              formData={formData}
              exportMode={true}
            />
          </div>
        );

      case 'cdeDiagram':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="cdeDiagram">
            <CDEPlatformEcosystem
              field={field}
              value={value}
              onChange={noop}
              exportMode={true}
            />
          </div>
        );

      case 'mindmap':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="mindmap">
            <VolumeStrategyMindmap
              field={field}
              value={value}
              onChange={noop}
            />
          </div>
        );

      case 'fileStructure':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="fileStructure">
            <FolderStructureDiagram
              field={field}
              value={value}
              onChange={noop}
            />
          </div>
        );

      case 'naming-conventions':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="naming-conventions">
            <NamingConventionBuilder
              field={field}
              value={value}
              onChange={noop}
            />
          </div>
        );

      case 'federation-strategy':
        return (
          <div className="my-6 p-6 bg-white rounded-lg border border-gray-200" data-field-name={field.name} data-component-type="federation-strategy">
            <FederationStrategyBuilder
              field={field}
              value={value}
              onChange={noop}
            />
          </div>
        );

      case 'table': {
        const tableRows = Array.isArray(value) ? value : (value?.data ?? []);
        const columns = (Array.isArray(value) ? field.columns : (value?.columns || field.columns)) || [];
        if (tableRows.length === 0) return null;
        return (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                        {row[col] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'milestones-table':
        if (!Array.isArray(value) || value.length === 0) return null;
        const milestoneColumns = field.columns?.length
          ? field.columns
          : ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date'];
        const normalizedMilestones = value.map(normalizeMilestoneRow);

        return (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {milestoneColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {normalizedMilestones.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {milestoneColumns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                        {row[col] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'checkbox':
        if (!Array.isArray(value) || value.length === 0) return null;
        return (
          <ul className="my-2 space-y-1">
            {value.map((item, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <span className="text-green-600 mr-2">✓</span>
                {item}
              </li>
            ))}
          </ul>
        );

      case 'textarea':
        if (typeof value === 'string' && isLikelyHtml(value)) {
          return (
            <div
              className="my-2 prose prose-sm max-w-none text-gray-700 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h4]:text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
            />
          );
        }

        return (
          <p className="my-2 text-gray-700 whitespace-pre-wrap">{value}</p>
        );

      case 'introTable':
        return (
          <div className="my-4">
            {value.intro && (
              <p className="mb-4 text-gray-700 whitespace-pre-wrap">{value.intro}</p>
            )}
            {value.rows && Array.isArray(value.rows) && value.rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {field.tableColumns?.map((col, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {value.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50">
                        {field.tableColumns?.map((col, colIdx) => (
                          <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                            {row[col] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default:
        return (
          <p className="my-2 text-gray-700">
            <span className="font-medium">{field.label}: </span>
            {String(value)}
          </p>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Cover Page */}
      <div className="mb-12 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">BIM EXECUTION PLAN</h1>
        <p className="text-xl mb-2">{CONFIG.bepTypeDefinitions[bepType]?.title}</p>
        <p className="text-sm italic opacity-90">ISO 19650-2:2018 Compliant</p>
        <div className="mt-8 pt-6 border-t border-white/30">
          <p className="text-lg"><strong>Project:</strong> {formData.projectName || 'Not specified'}</p>
          <p className="text-lg"><strong>Project Number:</strong> {formData.projectNumber || 'Not specified'}</p>
          <p className="text-sm mt-4 opacity-75">
            Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Section 0 — Document History & Governance (ISO 19650) */}
      {formData.documentHistory && (
        <div className="mb-10">
          <div className="mb-6 pb-2 border-b-2 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900">
              0. Document History &amp; Governance
              {formData.documentHistory.documentNumber && (
                <span className="ml-3 text-sm font-normal text-gray-500">
                  {formData.documentHistory.documentNumber}
                </span>
              )}
            </h2>
          </div>
          <div className="space-y-6">
            {/* 0.1 Revision History */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">0.1 — Revision History</h3>
              <div className="overflow-x-auto rounded border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Rev.', 'Date', 'Status', 'Author', 'Checked By', 'Description of Change'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.documentHistory.revisions || []).map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-1.5 font-mono font-semibold text-gray-800">{r.revisionCode}</td>
                        <td className="px-3 py-1.5 text-gray-600 whitespace-nowrap">{r.date}</td>
                        <td className="px-3 py-1.5"><span className="text-xs font-semibold">{r.statusCode}</span> — <span className="text-xs text-gray-500">{r.statusLabel}</span></td>
                        <td className="px-3 py-1.5">{r.author}</td>
                        <td className="px-3 py-1.5">{r.checkedBy}</td>
                        <td className="px-3 py-1.5">{r.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 0.2 Contributors */}
            {(formData.documentHistory.contributors || []).length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">0.2 — Contributors</h3>
                <div className="overflow-x-auto rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['Name', 'Company', 'Role'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.contributors.map((c, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-1.5">{c.name}</td>
                          <td className="px-3 py-1.5">{c.company}</td>
                          <td className="px-3 py-1.5">{c.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 0.3 Governance Triggers */}
            {(formData.documentHistory.governanceTriggers || []).length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  0.3 — Governance Triggers
                  <span className="ml-2 text-xs font-normal text-gray-400">(ISO 19650-2 §5.1.3)</span>
                </h3>
                <div className="overflow-x-auto rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Trigger Event</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Accountable Party</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.governanceTriggers.map((t, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-1.5">{t.trigger}</td>
                          <td className="px-3 py-1.5">{t.accountableParty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 0.4 RACI Review Record */}
            {(formData.documentHistory.raciReviewRecord || []).length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">0.4 — RACI Review Record</h3>
                <div className="overflow-x-auto rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['Function / Role', 'Individual', 'RACI', 'Date', 'Comments'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.raciReviewRecord.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-1.5">{r.function}</td>
                          <td className="px-3 py-1.5">{r.individual}</td>
                          <td className="px-3 py-1.5 font-bold text-center">{r.raci}</td>
                          <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">{r.date}</td>
                          <td className="px-3 py-1.5">{r.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BEP Content */}
      {CONFIG.steps.map((step, stepIndex) => {
        const stepConfig = CONFIG.getFormFields(bepType, stepIndex);
        if (!stepConfig || !stepConfig.fields) return null;

        return (
          <div key={stepIndex} className="mb-10">
            {/* Section Header */}
            <div className="mb-6 pb-2 border-b-2 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900">
                {stepConfig.number}. {stepConfig.title}
              </h2>
            </div>

            {/* Section Content */}
            <div className="space-y-6">
              {stepConfig.fields.map((field, fieldIndex) => {
                if (field.type === 'section-header') return null;

                const value = formData[field.name];
                if (!value) return null;

                return (
                  <div key={fieldIndex} className="pl-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {field.number && `${field.number} `}{field.label}
                    </h3>
                    {renderFieldValue(field, value)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* TIDP/MIDP Section */}
      {(tidpData.length > 0 || midpData.length > 0) && (
        <div className="mt-12 mb-10">
          <div className="mb-6 pb-2 border-b-2 border-amber-600">
            <h2 className="text-2xl font-bold text-gray-900">
              Information Delivery Planning
            </h2>
          </div>

          {tidpData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Task Information Delivery Plans (TIDPs)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Task Team</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Discipline</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Team Leader</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tidpData.map((tidp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{tidp.teamName || tidp.taskTeam || `Task Team ${idx + 1}`}</td>
                        <td className="px-4 py-2 text-sm">{tidp.discipline || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">{tidp.leader || tidp.teamLeader || 'TBD'}</td>
                        <td className="px-4 py-2 text-sm font-mono">TIDP-{String(idx + 1).padStart(2, '0')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {midpData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Master Information Delivery Plan (MIDP)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">MIDP Reference</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Version</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {midpData.map((midp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-mono">MIDP-{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-4 py-2 text-sm">{midp.version || '1.0'}</td>
                        <td className="px-4 py-2 text-sm">{midp.status || 'Active'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BepPreviewRenderer;
