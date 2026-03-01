import React from 'react';
import DOMPurify from 'dompurify';
import OrgStructureField from '../forms/specialized/OrgStructureField';
import OrgStructureDataTable from '../forms/specialized/OrgStructureDataTable';
import CDEPlatformEcosystem from '../forms/custom/CDEPlatformEcosystem';
import VolumeStrategyMindmap from '../forms/diagrams/diagram-components/VolumeStrategyMindmap';
import FolderStructureDiagram from '../forms/diagrams/diagram-components/FolderStructureDiagram';
import NamingConventionBuilder from '../forms/custom/NamingConventionBuilder';
import FederationStrategyBuilder from '../forms/custom/FederationStrategyBuilder';
import DocumentHierarchyDiagram from '../forms/diagrams/DocumentHierarchyDiagram';
import PartyInterfaceDiagram from '../forms/diagrams/PartyInterfaceDiagram';
import LoinProgressionDiagram from '../forms/diagrams/LoinProgressionDiagram';
import CONFIG from '../../config/bepConfig';
import { useSnippets } from '../../hooks/useSnippets';
import { resolveSnippetsInField } from '../../utils/snippetUtils';

// Module-level constants — defined once, not re-created on every render
const noop = () => {};

const isLikelyHtml = (value) => typeof value === 'string' && /<\/?[a-z][^>]*>/i.test(value);

/** Section 6.2 PIM delivery strategy subsections: show label even when value is empty */
const isPimDeliverySubsection = (field) =>
  field?.number && String(field.number).startsWith('6.2.');

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
      'Due Date': '',
      'Gate': '',
      'Programme version': ''
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
    'Due Date': getFirstValue(['Due Date', 'dueDate', 'Date', 'date']),
    'Gate': getFirstValue(['Gate', 'gate']),
    'Programme version': getFirstValue(['Programme version', 'programmeVersion'])
  };
};

/**
 * BEP Preview Renderer - Displays BEP content with React components
 * Shows both regular fields and custom visual components
 */
const BepPreviewRenderer = ({ formData, bepType, tidpData = [], midpData = [] }) => {
  const { snippetMap, resolve } = useSnippets();

  const renderFieldValue = (field, value) => {
    // Display-only fields (no form value)
    if (field.type === 'info-banner') {
      return (
        <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-800">
          {field.label}
        </div>
      );
    }
    if (field.type === 'static-diagram') {
      const diagramKey = field.diagramKey || field.config?.diagramKey || 'documentHierarchy';
      const Diagram = diagramKey === 'partyInterface' ? PartyInterfaceDiagram : diagramKey === 'loinProgression' ? LoinProgressionDiagram : DocumentHierarchyDiagram;
      return (
        <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 overflow-x-auto">
          <Diagram />
        </div>
      );
    }
    if (field.type === 'eir-reference') {
      return (
        <div className="my-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm text-gray-700">
          EIR managed in EIR Manager.
        </div>
      );
    }
    if (field.type === 'loin-reference') {
      return (
        <div className="my-4 rounded-lg border border-teal-200 bg-teal-50/50 p-3 text-sm text-gray-700">
          LOIN tables managed in LOIN Tables module.
        </div>
      );
    }

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

      case 'deliverables-matrix':
      case 'im-activities-matrix': {
        const rows = value?.data ?? [];
        const columns = value?.columns ?? field.columns ?? [];
        if (rows.length === 0) return null;
        return (
          <div className="my-4 table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx}>{row[col] ?? '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'table': {
        const tableRows = Array.isArray(value) ? value : (value?.data ?? []);
        const columns = (Array.isArray(value) ? field.columns : (value?.columns || field.columns)) || [];
        if (tableRows.length === 0) return null;
        return (
          <div className="my-4 table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx}>{row[col] ?? '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'milestones-table': {
        if (!Array.isArray(value) || value.length === 0) return null;
        const milestoneColumns = field.columns?.length
          ? field.columns
          : ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date'];
        const normalizedMilestones = value.map(normalizeMilestoneRow);

        return (
          <div className="my-4 table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {milestoneColumns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {normalizedMilestones.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {milestoneColumns.map((col, colIdx) => (
                      <td key={colIdx}>{row[col] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

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

      case 'textarea': {
        const resolvedText = typeof value === 'string' ? resolve(value) : value;
        if (typeof resolvedText === 'string' && isLikelyHtml(resolvedText)) {
          return (
            <div
              className="my-2 prose prose-sm max-w-none text-gray-700 rich-text-content [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h4]:text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(resolvedText) }}
            />
          );
        }

        return (
          <p className="my-2 text-gray-700 whitespace-pre-wrap">{resolvedText}</p>
        );
      }

      case 'introTable':
        return (
          <div className="my-4">
            {value.intro && (
              <p className="mb-4 text-gray-700 whitespace-pre-wrap">{resolve(value.intro)}</p>
            )}
            {value.rows && Array.isArray(value.rows) && value.rows.length > 0 && (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {field.tableColumns?.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {field.tableColumns?.map((col, colIdx) => (
                          <td key={colIdx}>{row[col] || '-'}</td>
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
            {typeof value === 'object' ? JSON.stringify(value) : resolve(String(value))}
          </p>
        );
    }
  };

  const generatedAt = new Date();

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
            Generated: {generatedAt.toLocaleDateString()} {generatedAt.toLocaleTimeString()}
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
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {['Rev.', 'Date', 'Status', 'Author', 'Checked By', 'Description of Change'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.documentHistory.revisions || []).map((r, i) => (
                      <tr key={i}>
                        <td className="font-mono font-semibold">{r.revisionCode}</td>
                        <td className="whitespace-nowrap">{r.date}</td>
                        <td><span className="text-xs font-semibold">{r.statusCode}</span> — <span className="text-xs text-gray-500">{r.statusLabel}</span></td>
                        <td>{r.author}</td>
                        <td>{r.checkedBy}</td>
                        <td>{r.description}</td>
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
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Name', 'Company', 'Role'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.contributors.map((c, i) => (
                        <tr key={i}>
                          <td>{c.name}</td>
                          <td>{c.company}</td>
                          <td>{c.role}</td>
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
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Trigger Event</th>
                        <th>Accountable Party</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.governanceTriggers.map((t, i) => (
                        <tr key={i}>
                          <td>{t.trigger}</td>
                          <td>{t.accountableParty}</td>
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
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Function / Role', 'Individual', 'RACI', 'Date', 'Comments'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documentHistory.raciReviewRecord.map((r, i) => (
                        <tr key={i}>
                          <td>{r.function}</td>
                          <td>{r.individual}</td>
                          <td className="font-bold text-center">{r.raci}</td>
                          <td className="whitespace-nowrap">{r.date}</td>
                          <td>{r.comments}</td>
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
                const resolvedField = resolveSnippetsInField(field, snippetMap);
                const value = formData[field.name];
                const isDisplayOnly = field.type === 'static-diagram' || field.type === 'info-banner' || field.type === 'section-header';
                const showWhenEmpty = isPimDeliverySubsection(field);
                if (!isDisplayOnly && !value && !showWhenEmpty) return null;

                if (field.type === 'section-header') {
                  return (
                    <div key={resolvedField.number || fieldIndex} className="pl-4 mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {resolvedField.number && `${resolvedField.number} `}{resolvedField.label}
                      </h3>
                    </div>
                  );
                }

                return (
                  <div key={resolvedField.name || fieldIndex} className="pl-4">
                    {resolvedField.label && (
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {resolvedField.number && `${resolvedField.number} `}{resolvedField.label}
                      </h3>
                    )}
                    {showWhenEmpty && !value ? (
                      <p className="my-2 text-gray-500 italic">—</p>
                    ) : (
                      renderFieldValue(resolvedField, value)
                    )}
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
              <div className="table-wrapper">
                <table className="data-table tidp-table">
                  <thead>
                    <tr>
                      <th>Task Team</th>
                      <th>Discipline</th>
                      <th>Team Leader</th>
                      <th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tidpData.map((tidp, idx) => (
                      <tr key={idx}>
                        <td>{tidp.teamName || tidp.taskTeam || `Task Team ${idx + 1}`}</td>
                        <td>{tidp.discipline || 'N/A'}</td>
                        <td>{tidp.leader || tidp.teamLeader || 'TBD'}</td>
                        <td className="font-mono">TIDP-{String(idx + 1).padStart(2, '0')}</td>
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
              <div className="table-wrapper">
                <table className="data-table midp-table">
                  <thead>
                    <tr>
                      <th>MIDP Reference</th>
                      <th>Version</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {midpData.map((midp, idx) => (
                      <tr key={idx}>
                        <td className="font-mono">MIDP-{String(idx + 1).padStart(2, '0')}</td>
                        <td>{midp.version || '1.0'}</td>
                        <td>{midp.status || 'Active'}</td>
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
