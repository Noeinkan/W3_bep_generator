/**
 * EIR Analysis View Component
 *
 * Displays the results of EIR document analysis in a structured format.
 * Shows both markdown summary and detailed JSON data.
 */

import { useState, useEffect, useRef } from 'react';
import {
  FileText, Target, Calendar, Settings, Users, Monitor,
  ChevronDown, AlertTriangle, CheckCircle,
  Download, RefreshCw, Copy, Check, Package
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { exportEirAnalysisPdf } from '../../services/eirExportService';

const ALL_SECTION_IDS = ['project', 'objectives', 'milestones', 'standards', 'cde', 'roles', 'risks', 'software'];

const EirAnalysisView = ({ analysis, summary, onUseInBep, onReanalyze, loading }) => {
  const [expandedSections, setExpandedSections] = useState({
    project: true,
    objectives: false,
    milestones: false,
    standards: false,
    cde: false,
    roles: false,
    risks: false,
    software: false,
  });
  const [copied, setCopied] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!showExportMenu) return;
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showExportMenu]);

  if (!analysis) {
    return (
      <div className="p-8 text-center text-gray-500">
        No analysis available. Upload and analyze an EIR document.
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const allExpanded = ALL_SECTION_IDS.every(id => expandedSections[id]);
  const handleToggleAll = () => {
    const next = !allExpanded;
    setExpandedSections(Object.fromEntries(ALL_SECTION_IDS.map(id => [id, next])));
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
      setCopied(true);
      setShowExportMenu(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eir-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    setPdfExporting(true);
    setPdfError(null);
    setShowExportMenu(false);
    try {
      const projectName = analysis.project_info?.name || 'EIR_Analysis';
      const safeName = projectName.replace(/[^\w\-]+/g, '_');
      await exportEirAnalysisPdf(analysis, summary, `EIR_Analysis_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      setPdfError(err.message || 'Failed to export PDF');
    } finally {
      setPdfExporting(false);
    }
  };

  // Stats bar counts
  const stats = [
    { label: 'Objectives', count: analysis.bim_objectives?.length },
    { label: 'Milestones', count: analysis.delivery_milestones?.length },
    { label: 'Roles', count: analysis.roles_responsibilities?.length },
    { label: 'Risks', count: analysis.specific_risks?.length },
  ].filter(s => s.count > 0);

  // Render markdown summary
  const renderSummary = () => {
    if (!summary) return null;
    const html = DOMPurify.sanitize(marked.parse(summary));
    return (
      <div
        className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-h2:uppercase prose-h2:tracking-wide prose-h2:text-xs prose-table:text-sm prose-td:py-2 prose-th:py-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  // Accordion section component
  const Section = ({ id, title, icon: Icon, children, badge }) => {
    const expanded = expandedSections[id];
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-800">{title}</span>
            {badge != null && badge > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                {badge}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        <div className={`grid transition-all duration-200 ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="p-5 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List item for objectives
  const ObjectiveItem = ({ text }) => (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );

  // Key-value pair component
  const KeyValue = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col sm:grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <span className="text-sm text-gray-800">{value}</span>
      </div>
    );
  };

  // Tag pill — two variants
  const TechTag = ({ text }) => (
    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-medium">
      {text}
    </span>
  );

  const StateTag = ({ text }) => (
    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
      {text}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            EIR Analysis Complete
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Requirements extracted from your EIR document. Review the findings and apply them to your BEP.
          </p>
          {stats.length > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {stats.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && <span className="mx-1.5">·</span>}
                  <span className="font-medium text-gray-500">{s.count}</span> {s.label}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Export dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={pdfExporting}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{pdfExporting ? 'Exporting…' : 'Export'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                  Download PDF
                </button>
                <div className="border-t border-gray-100" />
                <button
                  onClick={handleCopyJson}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                  Download JSON
                </button>
              </div>
            )}
          </div>

          {onReanalyze && (
            <button
              onClick={onReanalyze}
              disabled={loading}
              title="Re-run analysis"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reanalyze</span>
            </button>
          )}
        </div>
      </div>

      {pdfError && (
        <p className="text-sm text-red-600">{pdfError}</p>
      )}

      {/* Summary */}
      {summary && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </h3>
          {renderSummary()}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-2">
        {/* Expand / Collapse All */}
        <div className="flex justify-end">
          <button
            onClick={handleToggleAll}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        {/* Project Info */}
        <Section id="project" title="Project Information" icon={FileText}>
          <div>
            <KeyValue label="Project Name" value={analysis.project_info?.name} />
            <KeyValue label="Client" value={analysis.project_info?.client} />
            <KeyValue label="Project Type" value={analysis.project_info?.project_type} />
            <KeyValue label="Location" value={analysis.project_info?.location} />
            <KeyValue label="Estimated Value" value={analysis.project_info?.estimated_value} />
            {analysis.project_info?.description && (
              <div className="pt-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</span>
                <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">{analysis.project_info.description}</p>
              </div>
            )}
          </div>
        </Section>

        {/* BIM Objectives */}
        <Section
          id="objectives"
          title="BIM Objectives"
          icon={Target}
          badge={analysis.bim_objectives?.length}
        >
          {analysis.bim_objectives?.length > 0 ? (
            <ul className="space-y-2">
              {analysis.bim_objectives.map((obj, i) => (
                <ObjectiveItem key={i} text={obj} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No BIM objectives identified in document</p>
          )}
        </Section>

        {/* Milestones */}
        <Section
          id="milestones"
          title="Delivery Milestones"
          icon={Calendar}
          badge={analysis.delivery_milestones?.length}
        >
          {analysis.delivery_milestones?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Phase</th>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Description</th>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysis.delivery_milestones.map((ms, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-gray-800 whitespace-nowrap">{ms.phase}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{ms.description}</td>
                      <td className="py-2.5 text-gray-400 whitespace-nowrap">{ms.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No milestones identified in document</p>
          )}
        </Section>

        {/* Standards & Protocols */}
        <Section id="standards" title="Standards & Protocols" icon={Settings}>
          <div className="space-y-4">
            {analysis.standards_protocols?.classification_systems?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Classification Systems</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.standards_protocols.classification_systems.map((sys, i) => (
                    <StateTag key={i} text={sys} />
                  ))}
                </div>
              </div>
            )}
            {analysis.standards_protocols?.file_formats?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">File Formats</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.standards_protocols.file_formats.map((fmt, i) => (
                    <TechTag key={i} text={fmt} />
                  ))}
                </div>
              </div>
            )}
            <KeyValue label="Naming Conventions" value={analysis.standards_protocols?.naming_conventions} />
            <KeyValue label="LOD / LOI Requirements" value={analysis.standards_protocols?.lod_loi_requirements} />
          </div>
        </Section>

        {/* CDE Requirements */}
        <Section id="cde" title="CDE Requirements" icon={Monitor}>
          <div className="space-y-4">
            <KeyValue label="Platform" value={analysis.cde_requirements?.platform} />
            {analysis.cde_requirements?.workflow_states?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Workflow States</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.cde_requirements.workflow_states.map((state, i) => (
                    <StateTag key={i} text={state} />
                  ))}
                </div>
              </div>
            )}
            <KeyValue label="Access Control" value={analysis.cde_requirements?.access_control} />
          </div>
        </Section>

        {/* Roles & Responsibilities */}
        <Section
          id="roles"
          title="Roles & Responsibilities"
          icon={Users}
          badge={analysis.roles_responsibilities?.length}
        >
          {analysis.roles_responsibilities?.length > 0 ? (
            <div className="space-y-3">
              {analysis.roles_responsibilities.map((role, i) => (
                <div key={i} className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800">{role.role}</h4>
                  {role.responsibilities?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {role.responsibilities.map((resp, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-300 mt-0.5 flex-shrink-0">·</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No roles identified in document</p>
          )}
        </Section>

        {/* Risks */}
        {analysis.specific_risks?.length > 0 && (
          <Section
            id="risks"
            title="Risks & Specific Requirements"
            icon={AlertTriangle}
            badge={analysis.specific_risks.length}
          >
            <ul className="space-y-2">
              {analysis.specific_risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Software Requirements */}
        {analysis.software_requirements?.length > 0 && (
          <Section
            id="software"
            title="Required Software"
            icon={Package}
            badge={analysis.software_requirements.length}
          >
            <div className="flex flex-wrap gap-1.5">
              {analysis.software_requirements.map((sw, i) => (
                <TechTag key={i} text={sw} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        {onUseInBep && (
          <button
            onClick={() => onUseInBep(analysis)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Apply to BEP
          </button>
        )}
      </div>
    </div>
  );
};

export default EirAnalysisView;
