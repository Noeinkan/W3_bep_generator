/**
 * IFC entity list and suggestion for IDS (element name → IFC4 entity).
 * Mirrors server/services/idsGeneratorService.js IFC_ENTITY_MAP for UI.
 */

export const IFC_ENTITY_OPTIONS = [
  'IFCWALL', 'IFCSLAB', 'IFCCOLUMN', 'IFCBEAM', 'IFCDOOR', 'IFCWINDOW',
  'IFCROOF', 'IFCSTAIR', 'IFCRAMP', 'IFCSPACE', 'IFCZONE',
  'IFCPIPESEGMENT', 'IFCDUCTSEGMENT', 'IFCCABLECARRIERSEGMENT',
  'IFCFOOTING', 'IFCCURTAINWALL', 'IFCPLATE', 'IFCMEMBER', 'IFCPILE',
  'IFCBUILDING', 'IFCBUILDINGSTOREY',
];

const ELEMENT_PATTERNS = [
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

export function suggestIfcEntity(elementName) {
  if (!elementName || typeof elementName !== 'string') return null;
  const trimmed = elementName.trim();
  if (!trimmed) return null;
  for (const [pattern, entity] of ELEMENT_PATTERNS) {
    if (pattern.test(trimmed)) return entity;
  }
  return null;
}

export const IFC_DATA_TYPES = [
  'IFCLABEL', 'IFCTEXT', 'IFCIDENTIFIER', 'IFCBOOLEAN', 'IFCINTEGER', 'IFCREAL',
  'IFCLENGTHMEASURE', 'IFCAREAMEASURE', 'IFCVOLUMEMEASURE', 'IFCDATETIMESELECT',
];
