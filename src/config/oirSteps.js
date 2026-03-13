import { FileText, Building2, TrendingUp, Database, Scale, Cpu, Map } from 'lucide-react';
import { OIR_STEPS_DATA, OIR_STEP_CATEGORIES } from './oirStepsData.js';

export { OIR_STEP_CATEGORIES };

const OIR_STEP_ICONS = [FileText, Building2, TrendingUp, Database, Scale, Cpu, Map];

export const OIR_STEPS = OIR_STEPS_DATA.map((step, i) => ({
  ...step,
  icon: OIR_STEP_ICONS[i] ?? FileText
}));
