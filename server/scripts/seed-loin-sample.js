/**
 * One-off: seed pre-compiled LOIN rows for any existing "Sample Project".
 * Safe to run multiple times — skips projects that already have rows.
 * Usage: node server/scripts/seed-loin-sample.js
 */
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

const ROWS = [
  ['Architecture', 'Concept Design',   'External Walls',        '2D outline in plan and elevation',                                     'Construction type, approximate U-value, fire rating',                                           'Outline specification'],
  ['Architecture', 'Technical Design', 'External Walls',        '3D solid model LOD 300; all openings, cills, lintels',                 'Material, U-value, fire rating, acoustic rating, finish, manufacturer',                         'Product data sheets, full specifications'],
  ['Architecture', 'Handover',         'External Walls',        'As-built 3D model LOD 400',                                            'Manufacturer, product reference, warranty period, maintenance intervals',                       'As-built drawings, O&M manual, warranties'],
  ['Structure',    'Concept Design',   'Foundations',           '2D footprint with indicative depth',                                   'Foundation type, indicative load assumptions, soil bearing capacity',                           'Structural concept report'],
  ['Structure',    'Technical Design', 'Columns & Beams',       '3D solid model LOD 300; exact section sizes and positions',             'Steel grade, section reference, design load capacity, connection type',                         'Structural calculations, connection details'],
  ['MEP',          'Developed Design', 'HVAC Ductwork',         '3D duct routing — major plant and primary distribution only',           'Supply/extract air flow rates, duct sizes, pressure drop',                                      'Equipment schedules, ventilation design report'],
  ['MEP',          'Technical Design', 'Electrical — Lighting', '3D positions of luminaires and distribution boards',                   'Wattage, IP rating, circuit reference, design lux levels',                                      'Electrical circuit drawings, luminaire schedule'],
  ['Civil',        'Concept Design',   'Site Drainage',         '2D drainage network layout, pipe routes and invert levels',             'Pipe material, approximate sizes, gradients',                                                   'Drainage strategy report'],
  ['Civil',        'Technical Design', 'Site Roads & Paths',    '3D alignment and finished levels, kerb details',                        'Surfacing specification, construction depth, sub-base type',                                    'Highways specification, drainage drawings'],
  ['Fire Protection', 'Technical Design', 'Sprinkler System',   '3D head positions and main pipework LOD 300',                          'Coverage area per head, activation temperature, pipe sizes, design pressure',                   'Hydraulic calculations, BS EN 12845 compliance statement'],
];

const insert = db.prepare(
  'INSERT INTO loin_rows (id, project_id, discipline, stage, element, geometry, alphanumeric, documentation, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)'
);

const sampleProjects = db.prepare("SELECT id, name FROM projects WHERE name = 'Sample Project'").all();
if (sampleProjects.length === 0) {
  console.log('No Sample Project found — nothing to seed.');
  process.exit(0);
}

const now = new Date().toISOString();
for (const proj of sampleProjects) {
  const existing = db.prepare('SELECT COUNT(*) as c FROM loin_rows WHERE project_id = ?').get(proj.id);
  if (existing.c > 0) {
    console.log(`Skipping ${proj.id} (already has ${existing.c} rows)`);
    continue;
  }
  for (const r of ROWS) {
    insert.run(uuidv4(), proj.id, r[0], r[1], r[2], r[3], r[4], r[5], now, now);
  }
  console.log(`Seeded ${ROWS.length} LOIN rows for Sample Project (${proj.id})`);
}

console.log('Total loin_rows in DB:', db.prepare('SELECT COUNT(*) as c FROM loin_rows').get().c);
