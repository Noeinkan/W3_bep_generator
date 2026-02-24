import { Building, CheckCircle, Users, Target, Database, Calendar, Monitor, Settings, FileText, Shield, BookOpen, AlertCircle } from 'lucide-react';

export const STEP_CATEGORIES = {
  Commercial: { name: 'COMMERCIAL ASPECTS', bg: 'bg-blue-100 text-blue-800' },
  Management: { name: 'MANAGEMENT ASPECTS', bg: 'bg-green-100 text-green-800' },
  Technical: { name: 'TECHNICAL ASPECTS', bg: 'bg-purple-100 text-purple-800' }
};

export const BEP_STEPS = [
  { number: 1, title: 'BEP Type & Project Info', icon: Building, description: 'Define BEP type and basic project information', category: 'Commercial' },
  { number: 2, title: 'Executive Summary', icon: FileText, description: 'High-level overview and key commitments', category: 'Commercial' },
  { number: 3, title: 'Stakeholders & Roles', icon: Users, description: 'Define project stakeholders and responsibilities', category: 'Commercial' },
  { number: 4, title: 'BIM Goals & Uses', icon: Target, description: 'Define BIM objectives and applications', category: 'Commercial' },
  { number: 5, title: 'Level of Information Need', icon: Database, description: 'Specify LOIN requirements and content', category: 'Management' },
  { number: 6, title: 'Information Delivery Planning', icon: Calendar, description: 'MIDP, TIDPs and delivery schedules', category: 'Management' },
  { number: 7, title: 'Common Data Environment', icon: Monitor, description: 'CDE specification and workflows', category: 'Technical' },
  { number: 8, title: 'Technology Requirements', icon: Settings, description: 'Software, hardware and technical specs', category: 'Technical' },
  { number: 9, title: 'Information Production', icon: FileText, description: 'Methods, standards and procedures', category: 'Management' },
  { number: 10, title: 'Quality Assurance', icon: CheckCircle, description: 'QA framework and validation processes', category: 'Management' },
  { number: 11, title: 'Security & Privacy', icon: Shield, description: 'Information security and privacy measures', category: 'Management' },
  { number: 12, title: 'Training & Competency', icon: BookOpen, description: 'Training requirements and competency levels', category: 'Management' },
  { number: 13, title: 'Coordination & Risk', icon: AlertCircle, description: 'Collaboration procedures and risk management', category: 'Management' },
  { number: 14, title: 'Appendices', icon: FileText, description: 'Supporting materials and templates', category: 'Management' }
];
