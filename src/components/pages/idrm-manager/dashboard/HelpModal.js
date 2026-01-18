import React from 'react';
import { X, BookOpen, Table2, FileText, CheckCircle } from 'lucide-react';

const HelpModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">IDRM Manager Help</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Introduction */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">What is IDRM?</h3>
            <p className="text-gray-700 leading-relaxed">
              The Information Deliverables Responsibility Matrix (IDRM) is a key component of ISO 19650-2 information management.
              It defines who is responsible for creating, reviewing, and approving each information deliverable throughout the project lifecycle.
            </p>
          </div>

          {/* IM Activities */}
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">IM Activities Matrix</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Based on ISO 19650-2 Annex A, this matrix defines responsibility assignments (RACI) for 25 standard information management activities across project phases.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>R</strong>esponsible: Who does the work</li>
              <li><strong>A</strong>ccountable: Who has final authority</li>
              <li><strong>C</strong>onsulted: Who provides input</li>
              <li><strong>I</strong>nformed: Who needs to know</li>
            </ul>
          </div>

          {/* Deliverables */}
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Deliverables Matrix</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Track specific information deliverables including models, documents, and data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Responsible parties and reviewers</li>
              <li>Delivery milestones and due dates</li>
              <li>File formats and naming conventions</li>
              <li>Level of Detail (LOD) and Level of Information Need (LOIN)</li>
              <li>Auto-sync with TIDP containers</li>
            </ul>
          </div>

          {/* Templates */}
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Templates</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Create reusable IDRM templates for common project types to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Accelerate project setup with pre-configured matrices</li>
              <li>Ensure consistency across similar projects</li>
              <li>Share best practices within your organization</li>
              <li>Customize for specific project requirements</li>
            </ul>
          </div>

          {/* Integration */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Integration with BEP</h3>
            <p className="text-gray-700 leading-relaxed">
              IDRM matrices can be linked directly to your BIM Execution Plans. In Step 6 (Information Delivery Planning),
              you can reference existing matrices or create new ones specifically for that BEP document.
            </p>
          </div>

          {/* Best Practices */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Start with the standard ISO 19650-2 Annex A activities and customize as needed</li>
              <li>Link deliverables to specific TIDP containers for automatic synchronization</li>
              <li>Review and update responsibility assignments at key project milestones</li>
              <li>Use templates to standardize practices across your organization</li>
              <li>Export matrices regularly for stakeholder review and approval</li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
