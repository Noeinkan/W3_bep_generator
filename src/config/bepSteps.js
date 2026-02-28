import { Building, CheckCircle, Users, Target, Database, Calendar, Monitor, Settings, FileText, Shield, BookOpen, AlertCircle } from 'lucide-react';
import { BEP_STEPS_DATA, STEP_CATEGORIES } from './bepStepsData.js';

export { STEP_CATEGORIES };

const STEP_ICONS = [Building, FileText, Users, Target, Database, Calendar, Monitor, Settings, FileText, CheckCircle, Shield, BookOpen, AlertCircle, FileText];

export const BEP_STEPS = BEP_STEPS_DATA.map((step, i) => ({
  ...step,
  icon: STEP_ICONS[i] ?? FileText
}));
