import { FileText, BookOpen, Database, Settings, GitBranch, FolderOpen } from 'lucide-react';
import { EIR_STEPS_DATA, EIR_STEP_CATEGORIES } from './eirStepsData.js';

export { EIR_STEP_CATEGORIES };

const EIR_STEP_ICONS = [FileText, BookOpen, Database, Settings, GitBranch, FolderOpen];

export const EIR_STEPS = EIR_STEPS_DATA.map((step, i) => ({
  ...step,
  icon: EIR_STEP_ICONS[i] ?? FileText
}));
