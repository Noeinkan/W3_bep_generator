/**
 * Shared UI constants for sidebar collapse/expand toggles.
 * Used by both the main app sidebar (BEP Suite) and the BEP Generator sidebar
 * so collapse icons and button styling are identical and recallable.
 */

export const SIDEBAR_TOGGLE = {
  /** Button classes for the collapse/expand toggle (expanded state: larger hit area) */
  buttonExpanded: 'p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200',
  /** Button classes when sidebar is collapsed (compact) */
  buttonCollapsed: 'p-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200',
  /** ChevronLeft (collapse) icon size */
  iconCollapse: 'w-5 h-5',
  /** ChevronRight (expand) icon size */
  iconExpand: 'w-4 h-4',
};
