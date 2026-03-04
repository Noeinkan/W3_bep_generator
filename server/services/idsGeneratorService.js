/**
 * IDS (Information Delivery Specification) generator — buildingSMART IDS 1.0 XML
 * from LOIN rows with ifc_entity and property requirements.
 */

// IFC entity lookup: element name keywords → IFC4 entity name (~30 common mappings)
const IFC_ENTITY_MAP = [
  [/wall|walls/i, 'IFCWALL'],
  [/slab|floor|ceiling|floors|ceilings/i, 'IFCSLAB'],
  [/column|columns/i, 'IFCCOLUMN'],
  [/beam|beams/i, 'IFCBEAM'],
  [/door|doors/i, 'IFCDOOR'],
  [/window|windows/i, 'IFCWINDOW'],
  [/roof|roofs/i, 'IFCROOF'],
  [/stair|stairs/i, 'IFCSTAIR'],
  [/ramp|ramps/i, 'IFCRAMP'],
  [/space|room|rooms|spaces/i, 'IFCSPACE'],
  [/zone|zones/i, 'IFCZONE'],
  [/pipe|pipes/i, 'IFCPIPESEGMENT'],
  [/duct|ducts/i, 'IFCDUCTSEGMENT'],
  [/cable|cables/i, 'IFCCABLECARRIERSEGMENT'],
  [/foundation|foundations/i, 'IFCFOOTING'],
  [/curtain\s*wall|curtainwall/i, 'IFCCURTAINWALL'],
  [/plate|plates/i, 'IFCPLATE'],
  [/member|members/i, 'IFCMEMBER'],
  [/pile|piles/i, 'IFCPILE'],
  [/building|buildings/i, 'IFCBUILDING'],
  [/storey|storeys|level|levels/i, 'IFCBUILDINGSTOREY'],
];

/**
 * Suggest IFC entity from element name (e.g. "Wall" → "IFCWALL").
 * @param {string} elementName
 * @returns {string|null}
 */
function suggestIfcEntity(elementName) {
  if (!elementName || typeof elementName !== 'string') return null;
  const trimmed = elementName.trim();
  if (!trimmed) return null;
  for (const [pattern, entity] of IFC_ENTITY_MAP) {
    if (pattern.test(trimmed)) return entity;
  }
  return null;
}

/**
 * Escape text for XML text content.
 * @param {string} s
 * @returns {string}
 */
function escapeXml(s) {
  if (s == null || s === '') return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate IDS XML string from project name and enriched LOIN rows (with .properties[]).
 * One <specification> per row that has ifc_entity set.
 *
 * @param {string} projectName
 * @param {Array<{ id, discipline, stage, element, alphanumeric, ifc_entity, properties: Array<{ property_set, property_name, data_type, value_constraint }> }>} rows
 * @returns {string} IDS XML
 */
function generateIdsXml(projectName, rows) {
  const today = new Date().toISOString().slice(0, 10);
  const ns = 'http://standards.buildingsmart.org/IDS';
  const parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<ids xmlns="${ns}">`,
    '  <info>',
    `    <title>${escapeXml(projectName)} — Information Requirements</title>`,
    `    <date>${escapeXml(today)}</date>`,
    '    <ifcVersion>IFC4</ifcVersion>',
    '  </info>',
    '  <specifications>',
  ];

  const specs = rows.filter(r => r.ifc_entity && r.ifc_entity.trim());
  for (const row of specs) {
    const name = `${row.discipline || ''} | ${row.stage || ''} | ${row.element || ''}`.trim();
    const desc = (row.alphanumeric || '').trim().slice(0, 200);
    parts.push(`    <specification name="${escapeXml(name)}" ifcVersion="IFC4" description="${escapeXml(desc)}">`);
    parts.push('      <applicability minOccurs="0" maxOccurs="unbounded">');
    parts.push('        <entity><name><simpleValue>' + escapeXml(row.ifc_entity.trim()) + '</simpleValue></name></entity>');
    parts.push('      </applicability>');
    parts.push('      <requirements>');
    const props = row.properties || [];
    for (const p of props) {
      const dataType = (p.data_type || 'IFCLABEL').trim();
      parts.push(`        <property dataType="${escapeXml(dataType)}">`);
      parts.push('          <propertySet><simpleValue>' + escapeXml(p.property_set) + '</simpleValue></propertySet>');
      parts.push('          <baseName><simpleValue>' + escapeXml(p.property_name) + '</simpleValue></baseName>');
      if (p.value_constraint != null && String(p.value_constraint).trim() !== '') {
        parts.push('          <value><simpleValue>' + escapeXml(String(p.value_constraint).trim()) + '</simpleValue></value>');
      }
      parts.push('        </property>');
    }
    parts.push('      </requirements>');
    parts.push('    </specification>');
  }

  parts.push('  </specifications>');
  parts.push('</ids>');
  return parts.join('\n');
}

module.exports = { generateIdsXml, suggestIfcEntity, IFC_ENTITY_MAP };
