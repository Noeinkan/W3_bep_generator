import { Building, CheckCircle } from 'lucide-react';

export const BEP_TYPE_DEFINITIONS = {
  'pre-appointment': {
    title: 'Pre-Appointment BEP',
    subtitle: 'Tender Phase Document',
    description: 'A document outlining the prospective delivery team\'s proposed approach, capability, and capacity to meet the appointing party\'s exchange information requirements (EIRs). In the ISO 19650 hierarchy it sits after OIR → PIR → AIR/EIR; it demonstrates to the client that the potential delivery team can meet those requirements.',
    purpose: 'Demonstrates capability during tender phase',
    focus: 'Proposed approach and team capability',
    language: 'We propose to...  Our capability includes...  We would implement...',
    icon: Building,
    color: 'blue',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-900'
  },
  'post-appointment': {
    title: 'Post-Appointment BEP',
    subtitle: 'Project Execution Document',
    description: 'Confirms the delivery team\'s information management approach and includes the MIDP/TIDP, Information Standard response, and IPMP; the Mobilisation Plan and Risk Register sit alongside or within it. It is the delivery instrument the appointed team uses to produce, manage and exchange project information during the appointment.',
    purpose: 'Delivery instrument during project execution',
    focus: 'Confirmed approach with detailed planning',
    language: 'We will deliver...  The assigned team will...  Implementation schedule is...',
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    textClass: 'text-green-900'
  }
};
