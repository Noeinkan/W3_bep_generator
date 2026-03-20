/**
 * Capability Assessment service: CRUD for supply chain capability assessments per project.
 * Implements ISO 19650-2 Clause 5.3 task team capability tracking.
 */

const db = require('../database');
const { v4: uuidv4 } = require('uuid');

const JSON_COLUMNS = ['key_personnel', 'software_platforms', 'other_certifications', 'eir_requirements_met'];

function parseJsonColumns(row) {
  if (!row) return row;
  const parsed = { ...row };
  for (const col of JSON_COLUMNS) {
    if (typeof parsed[col] === 'string') {
      try { parsed[col] = JSON.parse(parsed[col]); } catch { parsed[col] = null; }
    }
  }
  return parsed;
}

function stringifyJsonColumns(data) {
  const result = { ...data };
  for (const col of JSON_COLUMNS) {
    if (result[col] !== undefined && result[col] !== null && typeof result[col] !== 'string') {
      result[col] = JSON.stringify(result[col]);
    }
  }
  return result;
}

function getById(id) {
  const row = db.prepare('SELECT * FROM capability_assessments WHERE id = ?').get(id);
  return parseJsonColumns(row);
}

function getByProject(projectId) {
  const rows = db.prepare(
    'SELECT * FROM capability_assessments WHERE project_id = ? ORDER BY team_name ASC'
  ).all(projectId);
  return rows.map(parseJsonColumns);
}

function create(data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const d = stringifyJsonColumns(data);
  db.prepare(`
    INSERT INTO capability_assessments (
      id, project_id, tidp_id, team_name, team_role, organisation,
      fte_available, fte_required, key_personnel, software_platforms,
      iso19650_training, other_certifications, training_plan, similar_projects,
      capability_gaps, mitigation_actions, eir_requirements_met, compliance_status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, d.project_id, d.tidp_id ?? null, d.team_name, d.team_role ?? null, d.organisation ?? null,
    d.fte_available ?? null, d.fte_required ?? null, d.key_personnel ?? null, d.software_platforms ?? null,
    d.iso19650_training ?? 'none', d.other_certifications ?? null, d.training_plan ?? null, d.similar_projects ?? null,
    d.capability_gaps ?? null, d.mitigation_actions ?? null, d.eir_requirements_met ?? null, d.compliance_status ?? 'draft',
    now, now
  );
  return getById(id);
}

function update(id, partial) {
  const row = getById(id);
  if (!row) return null;
  const now = new Date().toISOString();
  const p = stringifyJsonColumns(partial);

  db.prepare(`
    UPDATE capability_assessments SET
      tidp_id = ?, team_name = ?, team_role = ?, organisation = ?,
      fte_available = ?, fte_required = ?, key_personnel = ?, software_platforms = ?,
      iso19650_training = ?, other_certifications = ?, training_plan = ?, similar_projects = ?,
      capability_gaps = ?, mitigation_actions = ?, eir_requirements_met = ?, compliance_status = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    p.tidp_id !== undefined ? p.tidp_id : row.tidp_id,
    p.team_name !== undefined ? p.team_name : row.team_name,
    p.team_role !== undefined ? p.team_role : row.team_role,
    p.organisation !== undefined ? p.organisation : row.organisation,
    p.fte_available !== undefined ? p.fte_available : row.fte_available,
    p.fte_required !== undefined ? p.fte_required : row.fte_required,
    p.key_personnel !== undefined ? p.key_personnel : (row.key_personnel ? JSON.stringify(row.key_personnel) : null),
    p.software_platforms !== undefined ? p.software_platforms : (row.software_platforms ? JSON.stringify(row.software_platforms) : null),
    p.iso19650_training !== undefined ? p.iso19650_training : row.iso19650_training,
    p.other_certifications !== undefined ? p.other_certifications : (row.other_certifications ? JSON.stringify(row.other_certifications) : null),
    p.training_plan !== undefined ? p.training_plan : row.training_plan,
    p.similar_projects !== undefined ? p.similar_projects : row.similar_projects,
    p.capability_gaps !== undefined ? p.capability_gaps : row.capability_gaps,
    p.mitigation_actions !== undefined ? p.mitigation_actions : row.mitigation_actions,
    p.eir_requirements_met !== undefined ? p.eir_requirements_met : (row.eir_requirements_met ? JSON.stringify(row.eir_requirements_met) : null),
    p.compliance_status !== undefined ? p.compliance_status : row.compliance_status,
    now,
    id
  );
  return getById(id);
}

function deleteAssessment(id) {
  return db.prepare('DELETE FROM capability_assessments WHERE id = ?').run(id);
}

/**
 * Auto-generate one assessment stub per TIDP task team for a project.
 * Skips TIDPs whose teamName already has an assessment for this project.
 */
function fromTidps(projectId) {
  const tidps = db.prepare(
    'SELECT id, teamName, discipline, leader, company FROM tidps WHERE projectId = ?'
  ).all(projectId);

  const existing = db.prepare(
    'SELECT team_name, tidp_id FROM capability_assessments WHERE project_id = ?'
  ).all(projectId);
  const existingNames = new Set(existing.map(r => r.team_name));
  const existingTidpIds = new Set(existing.filter(r => r.tidp_id).map(r => r.tidp_id));

  const created = [];
  for (const tidp of tidps) {
    if (existingNames.has(tidp.teamName) || existingTidpIds.has(tidp.id)) continue;
    const assessment = create({
      project_id: projectId,
      tidp_id: tidp.id,
      team_name: tidp.teamName,
      team_role: tidp.discipline ?? null,
      organisation: tidp.company ?? null,
    });
    created.push(assessment);
  }
  return created;
}

/**
 * Aggregate KPIs for the summary dashboard.
 */
function getSummary(projectId) {
  const rows = db.prepare(
    'SELECT compliance_status, fte_available, fte_required, capability_gaps FROM capability_assessments WHERE project_id = ?'
  ).all(projectId);

  const total = rows.length;
  const compliant = rows.filter(r => r.compliance_status === 'compliant').length;
  const openGaps = rows.filter(r => r.capability_gaps && r.capability_gaps.trim().length > 0).length;

  let fteCoverageSum = 0;
  let fteCoverageCount = 0;
  for (const r of rows) {
    if (r.fte_required > 0 && r.fte_available != null) {
      fteCoverageSum += Math.min(r.fte_available / r.fte_required, 1);
      fteCoverageCount++;
    }
  }
  const avgFteCoverage = fteCoverageCount > 0 ? Math.round((fteCoverageSum / fteCoverageCount) * 100) : null;

  return { total, compliant, openGaps, avgFteCoverage };
}

module.exports = {
  getById,
  getByProject,
  create,
  update,
  deleteAssessment,
  fromTidps,
  getSummary,
};
