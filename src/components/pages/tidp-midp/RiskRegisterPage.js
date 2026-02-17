import React, { useState } from 'react';
import { AlertTriangle, Shield, Filter } from 'lucide-react';
import ApiService from '../../../services/apiService';
import { useMidpSubPage } from '../../../hooks/useMidpSubPage';
import { MidpSubPageLayout } from '../../common/MidpSubPageLayout';

const SEVERITY_COLORS = {
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200'
};

const PROBABILITY_BADGE = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-emerald-50 text-emerald-700'
};

const RiskRegisterPage = () => {
  const { data, loading } = useMidpSubPage(
    ApiService.getMIDPRiskRegister,
    'Failed to load risk register'
  );
  const [filterCategory, setFilterCategory] = useState('All');

  const riskRegister = data?.riskRegister || data || {};
  const risks = riskRegister.risks || [];
  const summary = riskRegister.summary || { total: 0, high: 0, medium: 0, low: 0 };
  const categories = Object.keys(riskRegister.categories || {});

  const filteredRisks = filterCategory === 'All'
    ? risks
    : risks.filter(r => r.category === filterCategory);

  return (
    <MidpSubPageLayout
      title="Risk Register"
      subtitle={`${summary.total} risks identified`}
      icon={Shield}
      iconGradient="from-red-500 to-orange-600"
      loading={loading}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Risks</p>
            <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
            <p className="text-sm text-red-600">High Impact</p>
            <p className="text-2xl font-bold text-red-700">{summary.high}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
            <p className="text-sm text-yellow-600">Medium Impact</p>
            <p className="text-2xl font-bold text-yellow-700">{summary.medium}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-600">Low Impact</p>
            <p className="text-2xl font-bold text-green-700">{summary.low}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">{filteredRisks.length} risks shown</span>
        </div>

        {/* Risk Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredRisks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No risks found{filterCategory !== 'All' ? ` in category "${filterCategory}"` : ''}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Impact</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Probability</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mitigation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">{risk.description}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {risk.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[risk.impact] || SEVERITY_COLORS.Medium}`}>
                          {risk.impact}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PROBABILITY_BADGE[risk.probability] || PROBABILITY_BADGE.Medium}`}>
                          {risk.probability}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{risk.mitigation}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{risk.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MidpSubPageLayout>
  );
};

export default RiskRegisterPage;
