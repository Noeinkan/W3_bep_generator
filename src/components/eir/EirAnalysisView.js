/**
 * EIR Analysis View Component
 *
 * Displays the results of EIR document analysis in a structured format.
 * Shows both markdown summary and detailed JSON data.
 */

import { useState } from 'react';
import {
  FileText, Target, Calendar, Settings, Users, Monitor,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle,
  Download, RefreshCw, Copy, Check
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const EirAnalysisView = ({ analysis, summary, onUseInBep, onReanalyze, loading }) => {
  const [expandedSections, setExpandedSections] = useState({
    project: true,
    objectives: true,
    milestones: false,
    standards: false,
    cde: false,
    roles: false,
    risks: false
  });
  const [copied, setCopied] = useState(false);

  if (!analysis) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nessuna analisi disponibile. Carica e analizza un documento EIR.
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
      setCopied(true);
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
  };

  // Render markdown summary
  const renderSummary = () => {
    if (!summary) return null;

    const html = DOMPurify.sanitize(marked.parse(summary));
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  // Section component
  const Section = ({ id, title, icon: Icon, children, badge }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>
        {expandedSections[id] ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expandedSections[id] && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  // List item component
  const ListItem = ({ text }) => (
    <li className="flex items-start gap-2 text-gray-700">
      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );

  // Key-value pair component
  const KeyValue = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-0">
        <span className="font-medium text-gray-600 sm:w-40 flex-shrink-0">{label}</span>
        <span className="text-gray-900">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Analisi EIR Completata
          </h2>
          <p className="mt-1 text-gray-600">
            Ecco le informazioni estratte dal documento EIR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copia JSON"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Scarica JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          {onReanalyze && (
            <button
              onClick={onReanalyze}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Rianalizza
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Riassunto
          </h3>
          {renderSummary()}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {/* Project Info */}
        <Section id="project" title="Informazioni Progetto" icon={FileText}>
          <div className="space-y-1">
            <KeyValue label="Nome Progetto" value={analysis.project_info?.name} />
            <KeyValue label="Cliente" value={analysis.project_info?.client} />
            <KeyValue label="Tipo Progetto" value={analysis.project_info?.project_type} />
            <KeyValue label="Ubicazione" value={analysis.project_info?.location} />
            <KeyValue label="Valore Stimato" value={analysis.project_info?.estimated_value} />
            {analysis.project_info?.description && (
              <div className="pt-2">
                <span className="font-medium text-gray-600">Descrizione:</span>
                <p className="mt-1 text-gray-700">{analysis.project_info.description}</p>
              </div>
            )}
          </div>
        </Section>

        {/* BIM Objectives */}
        <Section
          id="objectives"
          title="Obiettivi BIM"
          icon={Target}
          badge={analysis.bim_objectives?.length || 0}
        >
          {analysis.bim_objectives?.length > 0 ? (
            <ul className="space-y-2">
              {analysis.bim_objectives.map((obj, i) => (
                <ListItem key={i} text={obj} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Nessun obiettivo BIM identificato</p>
          )}
        </Section>

        {/* Milestones */}
        <Section
          id="milestones"
          title="Milestone di Consegna"
          icon={Calendar}
          badge={analysis.delivery_milestones?.length || 0}
        >
          {analysis.delivery_milestones?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Fase</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Descrizione</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysis.delivery_milestones.map((ms, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 font-medium text-gray-900">{ms.phase}</td>
                      <td className="px-4 py-2 text-gray-700">{ms.description}</td>
                      <td className="px-4 py-2 text-gray-500">{ms.date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nessuna milestone identificata</p>
          )}
        </Section>

        {/* Standards & Protocols */}
        <Section id="standards" title="Standard e Protocolli" icon={Settings}>
          <div className="space-y-4">
            {analysis.standards_protocols?.classification_systems?.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Sistemi di Classificazione:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.standards_protocols.classification_systems.map((sys, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.standards_protocols?.file_formats?.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Formati File:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.standards_protocols.file_formats.map((fmt, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <KeyValue
              label="Convenzioni di Naming"
              value={analysis.standards_protocols?.naming_conventions}
            />
            <KeyValue
              label="Requisiti LOD/LOI"
              value={analysis.standards_protocols?.lod_loi_requirements}
            />
          </div>
        </Section>

        {/* CDE Requirements */}
        <Section id="cde" title="Requisiti CDE" icon={Monitor}>
          <div className="space-y-4">
            <KeyValue label="Piattaforma" value={analysis.cde_requirements?.platform} />

            {analysis.cde_requirements?.workflow_states?.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Stati Workflow:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.cde_requirements.workflow_states.map((state, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <KeyValue
              label="Controllo Accessi"
              value={analysis.cde_requirements?.access_control}
            />
          </div>
        </Section>

        {/* Roles & Responsibilities */}
        <Section
          id="roles"
          title="Ruoli e Responsabilita"
          icon={Users}
          badge={analysis.roles_responsibilities?.length || 0}
        >
          {analysis.roles_responsibilities?.length > 0 ? (
            <div className="space-y-4">
              {analysis.roles_responsibilities.map((role, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{role.role}</h4>
                  {role.responsibilities?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {role.responsibilities.map((resp, j) => (
                        <li key={j}>- {resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Nessun ruolo identificato</p>
          )}
        </Section>

        {/* Risks */}
        {analysis.specific_risks?.length > 0 && (
          <Section
            id="risks"
            title="Rischi e Requisiti Specifici"
            icon={AlertTriangle}
            badge={analysis.specific_risks.length}
          >
            <ul className="space-y-2">
              {analysis.specific_risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Software Requirements */}
        {analysis.software_requirements?.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Software Richiesti</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.software_requirements.map((sw, i) => (
                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {sw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        {onUseInBep && (
          <button
            onClick={() => onUseInBep(analysis)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Usa queste informazioni nel BEP
          </button>
        )}
      </div>
    </div>
  );
};

export default EirAnalysisView;
