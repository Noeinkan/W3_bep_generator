import React from 'react';
import Modal from '../../../common/Modal';

const HelpModal = ({ show, onClose }) => {
  return (
    <Modal open={show} onClose={onClose} title="Relationship between TIDP and MIDP" size="xl">
      <div className="prose max-w-none">
        <p>In the context of ISO 19650, TIDPs (Task Information Delivery Plans) and the MIDP (Master Information Delivery Plan) are key elements for planning information delivery in a BIM project.</p>

        <h3>TIDP (Task Information Delivery Plan)</h3>
        <p>These are detailed plans prepared by each team or task team involved in the project. Each TIDP describes the specific information that team must produce, including deliverables (models, documents, data), delivery milestones, responsibilities (who does what), formats, and levels of detail (LOD/LOI). It is focused on individual or subgroup activities, and derives from the detailed responsibility matrix (Detailed Responsibility Matrix).</p>

        <h3>MIDP (Master Information Delivery Plan)</h3>
        <p>It is the overall master plan of the project, which integrates and coordinates all TIDPs from the various teams. The MIDP acts as the "main calendar" that aligns delivery timelines, ensures consistency between team contributions, and includes details such as task dependencies, revisions, approvals, and integration into the CDE. It is produced by the lead appointee (for example, the project information manager) and evolves during the project.</p>

        <h3>Relationship</h3>
        <p>The MIDP is essentially a collation and harmonization of the individual TIDPs. TIDPs provide granular details for each team, while the MIDP unites them into a unified framework for the entire project, ensuring that deliveries are synchronized with project milestones (for example, design, construction, or handover phases). This relationship is hierarchical: TIDPs feed the MIDP, which in turn informs the BIM Execution Plan (BEP) and supports verification of compliance with client-required information. In practice, a delay in one TIDP can impact the entire MIDP, thus promoting proactive collaboration.</p>
      </div>
    </Modal>
  );
};

export default HelpModal;
