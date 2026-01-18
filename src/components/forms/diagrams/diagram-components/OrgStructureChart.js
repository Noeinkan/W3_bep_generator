import React, { useState, useEffect } from 'react';

// Helper to build org chart data
function buildOrgChartData(data) {
  if (!data) return null;

  const appointingParty = data.appointingParty || 'Appointing Party';

  // Normalize leads
  let leads = [];
  if (Array.isArray(data.leadAppointedParty)) {
    leads = data.leadAppointedParty;
  } else if (typeof data.leadAppointedParty === 'string') {
    leads = [data.leadAppointedParty];
  }

  // Map appointed parties to leads
  let appointedMap = {};
  leads.forEach(lead => {
    appointedMap[lead] = [];
  });

  // Handle finalizedParties with strict mapping
  if (Array.isArray(data.finalizedParties) && data.finalizedParties.length > 0) {
    data.finalizedParties.forEach((party, index) => {
      // Only assign to a lead if explicitly specified
      const parentLead = party['Parent Lead'] || party['Lead Appointed Party'] || party['Lead'];
      if (parentLead && leads.includes(parentLead)) {
        appointedMap[parentLead].push({
          id: `appointed_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`,
          name: party['Company Name'] || party['Role/Service'] || 'Appointed Party',
          role: party['Role/Service'] || 'Appointed Party',
          contact: party['Lead Contact'] || ''
        });
      }
      // Parties without a valid parentLead are ignored to prevent misassignment
    });
  }

  return {
    id: `appointing_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name: appointingParty,
    role: 'Appointing Party',
    leadGroups: leads.map((lead, index) => ({
      id: `lead_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`,
      name: lead,
      role: 'Lead Appointed Party',
      contact: '', // Information Manager field
      children: appointedMap[lead] || []
    }))
  };
}

const OrgStructureChart = ({ data, onChange, editable = false }) => {
  // Build initial tree structure
  // If data has the tree structure (id, name, role, leadGroups), use it directly
  // Otherwise, build from legacy format (appointingParty, leadAppointedParty)
  const initialTree = data && data.id && data.leadGroups
    ? data
    : (data && data.appointingParty && data.leadAppointedParty
        ? buildOrgChartData(data)
        : data);

  const [orgData, setOrgData] = useState(initialTree);
  // Track editing state: { type: 'appointing' | 'lead' | 'appointed', index: number, appointedIndex?: number }
  const [editing, setEditing] = useState(null);
  // Track temporary input values during editing
  const [editValues, setEditValues] = useState({ name: '', role: '', contact: '' });

  // Update when data changes externally (but don't reset while user is editing)
  useEffect(() => {
    if (!data) return;

    // If data already has the tree structure, use it
    if (data.id && data.leadGroups) {
      // Only update if it's actually different (to avoid resetting user changes)
      if (JSON.stringify(data) !== JSON.stringify(orgData)) {
        setOrgData(data);
      }
      return;
    }

    // Otherwise build from legacy format
    const newTree = buildOrgChartData(data);
    const currentLeadNames = orgData?.leadGroups ? orgData.leadGroups.map(g => g.name) : [];
    const newLeadNames = newTree?.leadGroups ? newTree.leadGroups.map(g => g.name) : [];

    // Only update if the appointingParty or leadAppointedParty changed
    if (newTree && (newTree.name !== orgData?.name || JSON.stringify(newLeadNames) !== JSON.stringify(currentLeadNames))) {
      setOrgData(newTree);
    }
  }, [data]);

  // Helper to notify parent of changes
  const notifyChange = (newData) => {
    if (onChange && newData && newData.leadGroups) {
      const leads = newData.leadGroups.map(g => g.name);
      const finalizedParties = [];

      newData.leadGroups.forEach(group => {
        (group.children || []).forEach(child => {
          finalizedParties.push({
            'Role/Service': child.role || 'Appointed Party',
            'Company Name': child.name,
            'Lead Contact': child.contact || '',
            'Parent Lead': group.name
          });
        });
      });

      onChange({
        tree: newData,
        leadAppointedParty: leads,
        finalizedParties
      });
    }
  };

  // Start editing
  const startEditing = (type, index, appointedIndex = null) => {
    if (type === 'appointing') {
      setEditValues({ name: orgData.name, role: orgData.role, contact: '' });
    } else if (type === 'lead') {
      setEditValues({ 
        name: orgData.leadGroups[index].name, 
        role: orgData.leadGroups[index].role, 
        contact: orgData.leadGroups[index].contact || '' 
      });
    } else if (type === 'appointed') {
      const appointed = orgData.leadGroups[index].children[appointedIndex];
      setEditValues({ name: appointed.name, role: appointed.role, contact: appointed.contact || '' });
    }
    setEditing({ type, index, appointedIndex });
  };

  // Save edits
  const saveEdits = () => {
    if (!editValues.name.trim()) {
      alert('Name cannot be empty');
      return;
    }
    if (!editValues.role.trim() && editing.type !== 'appointing') {
      alert('Role cannot be empty');
      return;
    }

    let newOrgData = { ...orgData };
    if (editing.type === 'appointing') {
      newOrgData = { ...orgData, name: editValues.name };
    } else if (editing.type === 'lead') {
      const newLeadGroups = orgData.leadGroups.map((group, index) =>
        index === editing.index 
          ? { ...group, name: editValues.name, role: editValues.role, contact: editValues.contact } 
          : group
      );
      newOrgData = { ...orgData, leadGroups: newLeadGroups };
    } else if (editing.type === 'appointed') {
      const newLeadGroups = orgData.leadGroups.map((group, index) =>
        index === editing.index
          ? {
              ...group,
              children: group.children.map((child, i) =>
                i === editing.appointedIndex
                  ? { ...child, name: editValues.name, role: editValues.role, contact: editValues.contact }
                  : child
              )
            }
          : group
      );
      newOrgData = { ...orgData, leadGroups: newLeadGroups };
    }

    setOrgData(newOrgData);
    notifyChange(newOrgData);
    setEditing(null);
    setEditValues({ name: '', role: '', contact: '' });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(null);
    setEditValues({ name: '', role: '', contact: '' });
  };

  // Add a new lead
  const addLead = () => {
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: 'New Lead',
      role: 'Lead Appointed Party',
      contact: '', // Information Manager field
      children: [] // Always empty for new leads
    };

    const newOrgData = {
      ...orgData,
      leadGroups: [...(orgData.leadGroups || []), newLead]
    };

    setOrgData(newOrgData);
    notifyChange(newOrgData);
  };

  // Delete a lead
  const deleteLead = (leadIndex) => {
    if (!window.confirm('Delete this lead and all its appointed parties?')) return;

    const newLeadGroups = orgData.leadGroups.filter((_, index) => index !== leadIndex);
    const newOrgData = { ...orgData, leadGroups: newLeadGroups };

    setOrgData(newOrgData);
    notifyChange(newOrgData);
  };

  // Add appointed party to specific lead
  const addAppointedParty = (leadIndex) => {
    const newAppointed = {
      id: `appointed_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: 'New Appointed Party',
      role: 'Appointed Party',
      contact: ''
    };

    const newLeadGroups = orgData.leadGroups.map((group, index) =>
      index === leadIndex
        ? { ...group, children: [...(group.children || []), newAppointed] }
        : group
    );

    const newOrgData = { ...orgData, leadGroups: newLeadGroups };
    setOrgData(newOrgData);
    notifyChange(newOrgData);
  };

  // Delete appointed party
  const deleteAppointedParty = (leadIndex, appointedIndex) => {
    if (!window.confirm('Delete this appointed party?')) return;

    const newLeadGroups = orgData.leadGroups.map((group, index) =>
      index === leadIndex
        ? { ...group, children: group.children.filter((_, i) => i !== appointedIndex) }
        : group
    );

    const newOrgData = { ...orgData, leadGroups: newLeadGroups };
    setOrgData(newOrgData);
    notifyChange(newOrgData);
  };

  // Enhanced color palettes with lighter, more visible button colors
  const colorPalettes = [
    { 
      lead: '#2196f3', 
      appointed: '#e3f2fd', 
      border: '#1976d2',
      buttonEdit: '#1976d2',    // Medium blue (lighter)
      buttonDelete: '#e53935',  // Bright red (lighter)
      buttonAdd: '#43a047'      // Bright green (lighter)
    }, // Blue
    { 
      lead: '#4caf50', 
      appointed: '#e8f5e8', 
      border: '#388e3c',
      buttonEdit: '#2e7d32',    // Medium green (lighter)
      buttonDelete: '#e53935',  // Bright red
      buttonAdd: '#00897b'      // Teal (lighter)
    }, // Green
    { 
      lead: '#ff9800', 
      appointed: '#fff3e0', 
      border: '#f57c00',
      buttonEdit: '#f57c00',    // Medium orange (lighter)
      buttonDelete: '#d32f2f',  // Medium red (lighter)
      buttonAdd: '#43a047'      // Bright green
    }, // Orange
    { 
      lead: '#9c27b0', 
      appointed: '#f3e5f5', 
      border: '#7b1fa2',
      buttonEdit: '#7b1fa2',    // Medium purple (lighter)
      buttonDelete: '#e53935',  // Bright red
      buttonAdd: '#43a047'      // Bright green
    }, // Purple
    { 
      lead: '#f44336', 
      appointed: '#ffebee', 
      border: '#d32f2f',
      buttonEdit: '#c62828',    // Medium red (lighter)
      buttonDelete: '#8e24aa',  // Bright purple (lighter)
      buttonAdd: '#43a047'      // Bright green
    }, // Red
    { 
      lead: '#00bcd4', 
      appointed: '#e0f2f1', 
      border: '#0097a7',
      buttonEdit: '#0097a7',    // Medium cyan (lighter)
      buttonDelete: '#e53935',  // Bright red
      buttonAdd: '#43a047'      // Bright green
    }, // Cyan
    { 
      lead: '#795548', 
      appointed: '#efebe9', 
      border: '#5d4037',
      buttonEdit: '#5d4037',    // Medium brown (lighter)
      buttonDelete: '#e53935',  // Bright red
      buttonAdd: '#43a047'      // Bright green
    }, // Brown
    { 
      lead: '#607d8b', 
      appointed: '#eceff1', 
      border: '#455a64',
      buttonEdit: '#455a64',    // Medium grey (lighter)
      buttonDelete: '#e53935',  // Bright red
      buttonAdd: '#43a047'      // Bright green
    }  // Blue Grey
  ];

  if (!orgData || !orgData.leadGroups) {
    return <div>No organizational data available</div>;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      padding: '16px'
    }}>
      {/* Appointing Party */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          minWidth: '180px',
          maxWidth: '300px',
          background: '#fff',
          border: '2px solid #1976d2',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          {editing?.type === 'appointing' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                placeholder="Name"
                style={{
                  fontSize: '14px',
                  padding: '4px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                <button
                  onClick={saveEdits}
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#9e9e9e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '4px' }}>
                {orgData.name}
              </div>
              <div style={{ fontSize: '0.85em', color: '#555' }}>
                {orgData.role}
              </div>
              {editable && (
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => startEditing('appointing', 0)}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '4px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={addLead}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add Lead
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lead Groups Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(orgData.leadGroups.length, 5)}, 1fr)`,
        gap: '12px',
        width: '100%',
        maxWidth: '100%'
      }}>
        {orgData.leadGroups.map((lead, leadIndex) => {
          const colors = colorPalettes[leadIndex % colorPalettes.length];

          return (
            <div key={lead.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '0'
            }}>
              {/* Lead Node */}
              <div style={{
                width: '100%',
                maxWidth: '250px',
                background: colors.lead,
                border: `2px solid ${colors.border}`,
                borderRadius: '6px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
              {editing?.type === 'lead' && editing.index === leadIndex ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    placeholder="Name"
                    style={{
                      fontSize: '14px',
                      padding: '4px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px'
                    }}
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editValues.role}
                    onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
                    placeholder="Role"
                    style={{
                      fontSize: '12px',
                      padding: '4px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px'
                    }}
                  />
                  <input
                    type="text"
                    value={editValues.contact}
                    onChange={(e) => setEditValues({ ...editValues, contact: e.target.value })}
                    placeholder="Information Manager"
                    style={{
                      fontSize: '12px',
                      padding: '4px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button
                      onClick={saveEdits}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#9e9e9e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '0.95em', fontWeight: 'bold', marginBottom: '2px', color: 'white' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                    {lead.role}
                  </div>
                  {lead.contact && (
                    <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                      IM: {lead.contact}
                    </div>
                  )}
                  {editable && (
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => startEditing('lead', leadIndex)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 6px',
                          backgroundColor: colors.buttonEdit,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteLead(leadIndex)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 6px',
                          backgroundColor: colors.buttonDelete,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => addAppointedParty(leadIndex)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 6px',
                          backgroundColor: colors.buttonAdd,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      >
                        Add Appointed
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Appointed Parties Column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              width: '100%',
              maxWidth: '250px'
            }}>
              {(lead.children || []).map((appointed, appointedIndex) => (
                <div key={appointed.id} style={{
                  background: colors.appointed,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {editing?.type === 'appointed' && editing.index === leadIndex && editing.appointedIndex === appointedIndex ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        placeholder="Name"
                        style={{
                          fontSize: '14px',
                          padding: '4px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px'
                        }}
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editValues.role}
                        onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
                        placeholder="Role"
                        style={{
                          fontSize: '12px',
                          padding: '4px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px'
                        }}
                      />
                      <input
                        type="text"
                        value={editValues.contact}
                        onChange={(e) => setEditValues({ ...editValues, contact: e.target.value })}
                        placeholder="Information Manager"
                        style={{
                          fontSize: '12px',
                          padding: '4px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={saveEdits}
                          style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            backgroundColor: '#9e9e9e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.85em', fontWeight: 'bold', marginBottom: '2px', color: colors.border }}>
                        {appointed.name}
                      </div>
                      <div style={{ fontSize: '0.75em', color: colors.border, marginBottom: '2px', opacity: 0.8 }}>
                        {appointed.role}
                      </div>
                      {appointed.contact && (
                        <div style={{ fontSize: '0.7em', color: colors.border, marginBottom: '4px', opacity: 0.7 }}>
                          IM: {appointed.contact}
                        </div>
                      )}
                      {editable && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => startEditing('appointed', leadIndex, appointedIndex)}
                            style={{
                              fontSize: '10px',
                              padding: '2px 4px',
                              backgroundColor: colors.buttonEdit,
                              color: 'white',
                              border: 'none',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAppointedParty(leadIndex, appointedIndex)}
                            style={{
                              fontSize: '10px',
                              padding: '2px 4px',
                              backgroundColor: colors.buttonDelete,
                              color: 'white',
                              border: 'none',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                          >
                            Del
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default OrgStructureChart;