const { v4: uuidv4 } = require('uuid');
const { format, addDays, parseISO } = require('date-fns');
const _ = require('lodash');
const db = require('../database');

class TIDPService {
  constructor() {
    // SQLite database for persistent storage
  }

  /**
   * Create a new TIDP
   * @param {Object} tidpData - The TIDP data
   * @returns {Object} Created TIDP with generated ID
   */
  createTIDP(tidpData) {
    const tidp = {
      id: uuidv4(),
      ...tidpData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      status: tidpData.status || 'Draft'
    };

    // Validate and process information containers
    const containers = tidpData.containers || [];
    const processedContainers = containers.map(container => ({
      id: container.id || uuidv4(),
      ...container,
      createdAt: new Date().toISOString()
    }));

    // Process dependencies
    tidp.dependencies = this.processDependencies(tidpData.dependencies || []);

    // Insert TIDP into database
    const insertTidp = db.prepare(`
      INSERT INTO tidps (id, teamName, discipline, leader, company, responsibilities, projectId, createdAt, updatedAt, version, status, source, createdVia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Insert TIDP into database
    insertTidp.run(
      tidp.id,
      tidp.teamName,
      tidp.discipline,
      tidp.leader || null,
      tidp.company || null,
      tidp.responsibilities || null,
      tidp.projectId || null,
      tidp.createdAt,
      tidp.updatedAt,
      tidp.version,
      tidp.status,
      tidp.source || null,
      tidp.createdVia || null
    );

    // Insert containers
    const insertContainer = db.prepare(`
      INSERT INTO containers (
        id, tidp_id, information_container_id, container_name, description, task_name,
        responsible_party, author, dependencies, loin, classification, estimated_time,
        delivery_milestone, due_date, format_type, purpose, acceptance_criteria, review_process, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    processedContainers.forEach(container => {
      // Ensure due_date is a string (ISO) since better-sqlite3 cannot bind Date objects
      const dueDateValue = container['Due Date'] ? (
        (container['Due Date'] instanceof Date) ? container['Due Date'].toISOString() : String(container['Due Date'])
      ) : null;

      insertContainer.run(
        container.id,
        tidp.id,
        container['Information Container ID'] || null,
        container['Information Container Name/Title'] || container['Container Name'] || null,
        container['Description'] || null,
        container['Task Name'] || null,
        container['Responsible Task Team/Party'] || null,
        container['Author'] || null,
        JSON.stringify(container.dependencies || []),
        container['Level of Information Need (LOIN)'] || container['LOI Level'] || null,
        container['Classification'] || null,
        container['Estimated Production Time'] || container['Est. Time'] || null,
        container['Delivery Milestone'] || container.Milestone || null,
        dueDateValue,
        container['Format/Type'] || container.Format || container.Type || null,
        container['Purpose'] || null,
        container['Acceptance Criteria'] || null,
        container['Review and Authorization Process'] || null,
        container['Status'] || null,
        container.createdAt
      );
    });

    tidp.containers = processedContainers;
    return tidp;
  }

  /**
   * Update an existing TIDP
   * @param {string} id - TIDP ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated TIDP
   */
  updateTIDP(id, updateData) {
    const existingTidp = this.getTIDP(id);
    if (!existingTidp) {
      throw new Error(`TIDP with ID ${id} not found`);
    }

    const updatedAt = new Date().toISOString();
    const version = this.incrementVersion(existingTidp.version);

    // Update TIDP
    const updateStmt = db.prepare(`
      UPDATE tidps
      SET teamName = ?, discipline = ?, leader = ?, company = ?, responsibilities = ?,
          projectId = ?, updatedAt = ?, version = ?, status = ?
      WHERE id = ?
    `);

    updateStmt.run(
      updateData.teamName || existingTidp.teamName,
      updateData.discipline || existingTidp.discipline,
      updateData.leader || existingTidp.leader,
      updateData.company || existingTidp.company,
      updateData.responsibilities || existingTidp.responsibilities,
      updateData.projectId || existingTidp.projectId,
      updatedAt,
      version,
      updateData.status || existingTidp.status,
      id
    );

    // If containers are updated, delete old ones and insert new ones
    if (updateData.containers) {
      db.prepare('DELETE FROM containers WHERE tidp_id = ?').run(id);

      const insertContainer = db.prepare(`
        INSERT INTO containers (
          id, tidp_id, information_container_id, container_name, description, task_name,
          responsible_party, author, dependencies, loin, classification, estimated_time,
          delivery_milestone, due_date, format_type, purpose, acceptance_criteria, review_process, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      updateData.containers.forEach(container => {
        // Normalize due date to ISO string to avoid binding non-primitive values
        const dueDateVal = container['Due Date'] ? (
          (container['Due Date'] instanceof Date) ? container['Due Date'].toISOString() : String(container['Due Date'])
        ) : null;

        insertContainer.run(
          container.id || uuidv4(),
          id,
          container['Information Container ID'] || null,
          container['Information Container Name/Title'] || container['Container Name'] || null,
          container['Description'] || null,
          container['Task Name'] || null,
          container['Responsible Task Team/Party'] || null,
          container['Author'] || null,
          JSON.stringify(container.dependencies || []),
          container['Level of Information Need (LOIN)'] || container['LOI Level'] || null,
          container['Classification'] || null,
          container['Estimated Production Time'] || container['Est. Time'] || null,
          container['Delivery Milestone'] || container.Milestone || null,
          dueDateVal,
          container['Format/Type'] || container.Format || container.Type || null,
          container['Purpose'] || null,
          container['Acceptance Criteria'] || null,
          container['Review and Authorization Process'] || null,
          container['Status'] || null,
          new Date().toISOString()
        );
      });
    }

    return this.getTIDP(id);
  }

  /**
   * Get TIDP by ID
   * @param {string} id - TIDP ID
   * @returns {Object} TIDP data
   */
  getTIDP(id) {
    const tidp = db.prepare('SELECT * FROM tidps WHERE id = ?').get(id);
    if (!tidp) {
      throw new Error(`TIDP with ID ${id} not found`);
    }

    // Get containers
    const containers = db.prepare('SELECT * FROM containers WHERE tidp_id = ?').all(id);

    // Convert containers to original format
    tidp.containers = containers.map(c => ({
      id: c.id,
      'Information Container ID': c.information_container_id,
      'Container Name': c.container_name,
      'Information Container Name/Title': c.container_name,
      'Description': c.description,
      'Task Name': c.task_name,
      'Responsible Task Team/Party': c.responsible_party,
      'Author': c.author,
      'dependencies': JSON.parse(c.dependencies || '[]'),
      'Level of Information Need (LOIN)': c.loin,
      'LOI Level': c.loin,
      'Classification': c.classification,
      'Estimated Production Time': c.estimated_time,
      'Est. Time': c.estimated_time,
      'Delivery Milestone': c.delivery_milestone,
      'Milestone': c.delivery_milestone,
      'Due Date': c.due_date,
      'Format/Type': c.format_type,
      'Format': c.format_type,
      'Type': c.format_type,
      'Purpose': c.purpose,
      'Acceptance Criteria': c.acceptance_criteria,
      'Review and Authorization Process': c.review_process,
      'Status': c.status,
      'createdAt': c.createdAt
    }));

    return tidp;
  }

  /**
   * Get all TIDPs
   * @returns {Array} Array of all TIDPs
   */
  getAllTIDPs() {
    const tidps = db.prepare('SELECT * FROM tidps').all();
    return tidps.map(tidp => this.getTIDP(tidp.id));
  }

  /**
   * Get TIDPs by project
   * @param {string} projectId - Project ID
   * @returns {Array} Array of TIDPs for the project
   */
  getTIDPsByProject(projectId) {
    const tidps = db.prepare('SELECT * FROM tidps WHERE projectId = ?').all(projectId);
    return tidps.map(tidp => this.getTIDP(tidp.id));
  }

  /**
   * Delete TIDP
   * @param {string} id - TIDP ID
   * @returns {boolean} Success status
   */
  deleteTIDP(id) {
    const tidp = db.prepare('SELECT * FROM tidps WHERE id = ?').get(id);
    if (!tidp) {
      throw new Error(`TIDP with ID ${id} not found`);
    }

    // Containers will be deleted automatically due to CASCADE
    const result = db.prepare('DELETE FROM tidps WHERE id = ?').run(id);
    return result.changes > 0;
  }

  /**
   * Validate TIDP dependencies
   * @param {Array} dependencies - Array of dependencies
   * @returns {Object} Validation result
   */
  validateDependencies(dependencies) {
    const issues = [];
    const warnings = [];

    dependencies.forEach((dep, index) => {
      // Check for circular dependencies
      if (this.hasCircularDependency(dep)) {
        issues.push(`Circular dependency detected in dependency ${index + 1}`);
      }

      // Check if predecessor exists
      if (dep.predecessorId) {
        const exists = db.prepare('SELECT id FROM tidps WHERE id = ?').get(dep.predecessorId);
        if (!exists) {
          warnings.push(`Predecessor TIDP ${dep.predecessorId} not found for dependency ${index + 1}`);
        }
      }

      // Validate dates
      if (dep.requiredDate && dep.availableDate) {
        const required = parseISO(dep.requiredDate);
        const available = parseISO(dep.availableDate);

        if (available > required) {
          issues.push(`Dependency ${index + 1}: Available date is after required date`);
        }
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Generate dependency matrix for a project
   * @param {string} projectId - Project ID
   * @returns {Object} Dependency matrix and analysis
   */
  generateDependencyMatrix(projectId) {
    const projectTidps = this.getTIDPsByProject(projectId);
    const matrix = [];
    const criticalPath = [];

    projectTidps.forEach(tidp => {
      if (tidp.containers) {
        tidp.containers.forEach(container => {
          const dependencies = container.dependencies || [];

          dependencies.forEach(depId => {
            const dependencyTidp = projectTidps.find(t =>
              t.containers && t.containers.some(c => c.id === depId)
            );

            if (dependencyTidp) {
              matrix.push({
                from: {
                  tidpId: dependencyTidp.id,
                  tidpName: dependencyTidp.teamName,
                  containerId: depId
                },
                to: {
                  tidpId: tidp.id,
                  tidpName: tidp.teamName,
                  containerId: container.id,
                  containerName: container['Container Name'] || container.name
                },
                type: 'information_dependency',
                criticalPath: this.isOnCriticalPath(dependencyTidp.id, tidp.id, projectTidps)
              });
            }
          });
        });
      }
    });

    return {
      matrix,
      criticalPath: this.calculateCriticalPath(projectTidps),
      summary: {
        totalDependencies: matrix.length,
        criticalDependencies: matrix.filter(m => m.criticalPath).length,
        teamsInvolved: _.uniq(matrix.flatMap(m => [m.from.tidpName, m.to.tidpName])).length
      }
    };
  }

  /**
   * Calculate resource allocation across TIDPs
   * @param {Array} tidps - Array of TIDPs
   * @returns {Object} Resource allocation summary
   */
  calculateResourceAllocation(tidps) {
    const allocation = {
      byDiscipline: {},
      byPeriod: {},
      totalResources: 0,
      peakUtilization: { period: null, resources: 0 }
    };

    tidps.forEach(tidp => {
      // Group by discipline
      const discipline = tidp.discipline;
      if (!allocation.byDiscipline[discipline]) {
        allocation.byDiscipline[discipline] = {
          teams: 0,
          containers: 0,
          estimatedHours: 0
        };
      }

      allocation.byDiscipline[discipline].teams += 1;
      allocation.byDiscipline[discipline].containers += tidp.containers?.length || 0;

      // Calculate estimated hours from containers
      if (tidp.containers) {
        tidp.containers.forEach(container => {
          const timeStr = container['Est. Time'] || container.estimatedProductionTime || '0';
          const hours = this.parseTimeToHours(timeStr);
          allocation.byDiscipline[discipline].estimatedHours += hours;
          allocation.totalResources += hours;
        });
      }
    });

    return allocation;
  }

  // Helper methods
  processDependencies(dependencies) {
    return dependencies.map(dep => ({
      id: dep.id || uuidv4(),
      ...dep,
      processedAt: new Date().toISOString()
    }));
  }

  incrementVersion(currentVersion) {
    const parts = currentVersion.split('.');
    const patch = parseInt(parts[2] || 0) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }

  /**
   * Detect circular dependencies using DFS cycle detection.
   * When called from validateDependencies with a single dependency object,
   * builds the full container dependency graph and checks for cycles.
   * @param {Object|null} dependency - Optional single dependency to check context for
   * @returns {boolean} True if a circular dependency exists
   */
  hasCircularDependency(dependency) {
    // Build adjacency list from all containers in the database
    const allTidps = this.getAllTIDPs();
    const adjacency = new Map(); // containerId -> [dependsOn containerIds]

    allTidps.forEach(tidp => {
      if (tidp.containers) {
        tidp.containers.forEach(container => {
          const deps = container.dependencies || [];
          adjacency.set(container.id, deps);
        });
      }
    });

    // DFS cycle detection
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map();
    adjacency.forEach((_, id) => color.set(id, WHITE));

    const hasCycle = (nodeId) => {
      color.set(nodeId, GRAY);
      const neighbors = adjacency.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!color.has(neighbor)) continue; // external dependency, skip
        if (color.get(neighbor) === GRAY) return true; // back edge = cycle
        if (color.get(neighbor) === WHITE && hasCycle(neighbor)) return true;
      }
      color.set(nodeId, BLACK);
      return false;
    };

    for (const [nodeId, c] of color) {
      if (c === WHITE && hasCycle(nodeId)) return true;
    }

    return false;
  }

  /**
   * Check if a dependency edge is on the critical path.
   * @param {string} fromTidpId - Source TIDP ID
   * @param {string} toTidpId - Target TIDP ID
   * @param {Array} allTidps - All TIDPs in the project
   * @returns {boolean} True if this edge is on the critical path
   */
  isOnCriticalPath(fromTidpId, toTidpId, allTidps) {
    const cpResult = this.calculateCriticalPath(allTidps);
    const cpIds = new Set(cpResult.map(item => item.id));
    return cpIds.has(fromTidpId) && cpIds.has(toTidpId);
  }

  /**
   * Calculate the critical path using the Critical Path Method (CPM).
   * Forward pass: compute earliest start (ES) and earliest finish (EF).
   * Backward pass: compute latest start (LS) and latest finish (LF).
   * Critical path = containers with zero total float (LF - EF = 0).
   * @param {Array} tidps - Array of TIDP objects
   * @returns {Array} Array of container objects on the critical path
   */
  calculateCriticalPath(tidps) {
    // Flatten all containers with their TIDP context
    const containers = [];
    const containerMap = new Map();

    tidps.forEach(tidp => {
      if (tidp.containers) {
        tidp.containers.forEach(container => {
          const duration = this.parseTimeToHours(
            container['Est. Time'] || container.estimatedProductionTime || '0'
          );
          const node = {
            id: container.id,
            name: container['Container Name'] || container.name,
            tidpId: tidp.id,
            tidpName: tidp.teamName,
            discipline: tidp.discipline,
            duration,
            dependencies: container.dependencies || [],
            dueDate: container['Due Date'] || container.dueDate,
            es: 0, ef: 0, ls: Infinity, lf: Infinity, totalFloat: 0
          };
          containers.push(node);
          containerMap.set(container.id, node);
        });
      }
    });

    if (containers.length === 0) return [];

    // Topological sort using Kahn's algorithm
    const inDegree = new Map();
    const adjList = new Map(); // containerId -> [containers that depend on it]

    containers.forEach(c => {
      inDegree.set(c.id, 0);
      adjList.set(c.id, []);
    });

    containers.forEach(c => {
      c.dependencies.forEach(depId => {
        if (containerMap.has(depId)) {
          adjList.get(depId).push(c.id);
          inDegree.set(c.id, (inDegree.get(c.id) || 0) + 1);
        }
      });
    });

    // Kahn's algorithm for topological order
    const queue = [];
    containers.forEach(c => {
      if (inDegree.get(c.id) === 0) queue.push(c.id);
    });

    const topoOrder = [];
    while (queue.length > 0) {
      const nodeId = queue.shift();
      topoOrder.push(nodeId);
      (adjList.get(nodeId) || []).forEach(neighborId => {
        inDegree.set(neighborId, inDegree.get(neighborId) - 1);
        if (inDegree.get(neighborId) === 0) queue.push(neighborId);
      });
    }

    // If not all nodes are in topoOrder, there's a cycle — return empty
    if (topoOrder.length !== containers.length) return [];

    // Forward pass: ES and EF
    topoOrder.forEach(nodeId => {
      const node = containerMap.get(nodeId);
      node.dependencies.forEach(depId => {
        const dep = containerMap.get(depId);
        if (dep && dep.ef > node.es) {
          node.es = dep.ef;
        }
      });
      node.ef = node.es + node.duration;
    });

    // Find project duration (max EF)
    const projectDuration = Math.max(...containers.map(c => c.ef), 0);

    // Backward pass: LF and LS
    // Initialize all LF to projectDuration
    containers.forEach(c => { c.lf = projectDuration; });

    // Process in reverse topological order
    for (let i = topoOrder.length - 1; i >= 0; i--) {
      const nodeId = topoOrder[i];
      const node = containerMap.get(nodeId);

      // Update LF based on successors
      (adjList.get(nodeId) || []).forEach(successorId => {
        const successor = containerMap.get(successorId);
        if (successor && successor.ls < node.lf) {
          node.lf = successor.ls;
        }
      });

      node.ls = node.lf - node.duration;
      node.totalFloat = node.lf - node.ef;
    }

    // Critical path = nodes with zero total float
    return containers
      .filter(c => c.totalFloat === 0 && c.duration > 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        tidpId: c.tidpId,
        tidpName: c.tidpName,
        discipline: c.discipline,
        duration: c.duration,
        es: c.es,
        ef: c.ef,
        ls: c.ls,
        lf: c.lf,
        totalFloat: c.totalFloat
      }));
  }

  parseTimeToHours(timeString) {
    // Parse time strings like "2 weeks", "3 days", "40 hours"
    const timeStr = timeString.toLowerCase();

    if (timeStr.includes('week')) {
      const weeks = parseInt(timeStr);
      return weeks * 40; // Assuming 40 hours per week
    } else if (timeStr.includes('day')) {
      const days = parseInt(timeStr);
      return days * 8; // Assuming 8 hours per day
    } else if (timeStr.includes('hour')) {
      return parseInt(timeStr);
    }

    return 0;
  }

  /**
   * Export TIDP summary for reporting
   * @param {string} tidpId - TIDP ID
   * @returns {Object} TIDP summary for export
   */
  exportTIDPSummary(tidpId) {
    const tidp = this.getTIDP(tidpId);

    return {
      id: tidp.id,
      teamName: tidp.teamName,
      discipline: tidp.discipline,
      leader: tidp.leader,
      company: tidp.company,
      containerCount: tidp.containers?.length || 0,
      totalEstimatedHours: tidp.containers?.reduce((total, container) => {
        return total + this.parseTimeToHours(container['Est. Time'] || container.estimatedProductionTime || '0');
      }, 0) || 0,
      milestones: _.uniq(tidp.containers?.map(c => c.Milestone || c.deliveryMilestone) || []),
      lastUpdated: tidp.updatedAt,
      version: tidp.version,
      status: tidp.status
    };
  }

  /**
   * Import TIDPs from Excel data
   * @param {Array} excelData - Array of rows from Excel
   * @param {string} projectId - Project ID to associate with
   * @returns {Object} Import results
   */
  importTIDPsFromExcel(excelData, projectId) {
    const successful = [];
    const failed = [];

    // Group rows by Team Name to create one TIDP per team
    const groupedByTeam = {};

    excelData.forEach((row, index) => {
      try {
        const teamName = row['Team Name'] || row.teamName || row['Responsible Task Team/Party'] || 'Imported Team';

        if (!groupedByTeam[teamName]) {
          groupedByTeam[teamName] = {
            teamName: teamName,
            discipline: row['Discipline'] || row.discipline || 'General',
            leader: row['Leader'] || row.leader || row['Team Leader'] || 'TBD',
            company: row['Company'] || row.company || 'TBD',
            responsibilities: row['Responsibilities'] || row.responsibilities || row['Description'] || 'Imported from external source',
            projectId: projectId || 'imported-project',
            containers: []
          };
        }

        // Parse container from row
        const container = this.parseExcelRowToContainer(row, groupedByTeam[teamName].leader);
        if (container) {
          groupedByTeam[teamName].containers.push(container);
        }
      } catch (error) {
        failed.push({
          row: index + 2, // +2 because Excel is 1-indexed and has header row
          error: error.message,
          data: row
        });
      }
    });

    // Create TIDPs from grouped data
    Object.values(groupedByTeam).forEach((tidpData) => {
      try {
        if (tidpData.containers.length > 0) {
          const created = this.createTIDP(tidpData);
          successful.push(created);
        }
      } catch (error) {
        failed.push({
          team: tidpData.teamName,
          error: error.message
        });
      }
    });

    return { successful, failed, total: excelData.length };
  }

  /**
   * Import TIDPs from CSV data
   * @param {Array} csvData - Array of rows from CSV
   * @param {string} projectId - Project ID to associate with
   * @returns {Object} Import results
   */
  importTIDPsFromCSV(csvData, projectId) {
    return this.importTIDPsFromExcel(csvData, projectId); // Same logic
  }

  /**
   * Parse Excel row to Container object
   * @param {Object} row - Excel row data
   * @param {string} defaultAuthor - Default author name
   * @returns {Object} Container object
   */
  parseExcelRowToContainer(row, defaultAuthor) {
    // Support multiple column name formats
    const containerName = row['Information Container Name/Title'] ||
                         row['Container Name'] ||
                         row['Deliverable'] ||
                         row.containerName ||
                         row['Information Container ID'];

    if (!containerName) {
      return null; // Skip rows without a container name
    }

    return {
      id: uuidv4(),
      'Information Container ID': row['Information Container ID'] || row.containerId || `IC-${Date.now()}`,
      'Information Container Name/Title': containerName,
      'Description': row['Description'] || row.description || '',
      'Task Name': row['Task Name'] || row.taskName || '',
      'Responsible Task Team/Party': row['Responsible Task Team/Party'] || row['Team Name'] || row.teamName || defaultAuthor,
      'Author': row['Author'] || row.author || defaultAuthor,
      'Dependencies/Predecessors': row['Dependencies/Predecessors'] || row.dependencies || '',
      'Level of Information Need (LOIN)': row['Level of Information Need (LOIN)'] || row['LOI Level'] || row.loiLevel || 'LOD 300',
      'Classification': row['Classification'] || row.classification || '',
      'Estimated Production Time': row['Estimated Production Time'] || row['Est. Time'] || row.estimatedTime || '1 week',
      'Delivery Milestone': row['Delivery Milestone'] || row['Milestone'] || row.milestone || 'Stage 1',
      'Due Date': row['Due Date'] || row.dueDate || new Date().toISOString().slice(0, 10),
      'Format/Type': row['Format/Type'] || row['Format'] || row.format || row['Type'] || row.type || 'IFC',
      'Purpose': row['Purpose'] || row.purpose || '',
      'Acceptance Criteria': row['Acceptance Criteria'] || row.acceptanceCriteria || '',
      'Review and Authorization Process': row['Review and Authorization Process'] || row.reviewProcess || '',
      'Status': row['Status'] || row.status || 'Planned'
    };
  }

  /**
   * Get Excel import template
   * @returns {Object} Template structure
   */
  getExcelImportTemplate() {
    return {
      headers: [
        'Team Name',
        'Discipline',
        'Leader',
        'Company',
        'Responsibilities',
        'Container Name',
        'Type',
        'Format',
        'LOI Level',
        'Author',
        'Est. Time',
        'Milestone',
        'Due Date',
        'Status'
      ],
      sampleData: [
        {
          'Team Name': 'Architecture Team',
          'Discipline': 'architecture',
          'Leader': 'John Smith',
          'Company': 'ABC Architects',
          'Responsibilities': 'Architectural design and coordination',
          'Container Name': 'Architectural Model',
          'Type': 'Model',
          'Format': 'IFC',
          'LOI Level': 'LOD 300',
          'Author': 'John Smith',
          'Est. Time': '2 weeks',
          'Milestone': 'Design Development',
          'Due Date': '2024-12-31',
          'Status': 'Planned'
        }
      ],
      notes: [
        'Each row can represent either a complete TIDP with one container, or just container data for an existing team',
        'If Team Name is repeated, containers will be grouped under the same TIDP',
        'Discipline options: architecture, structural, mep, civil',
        'Type options: Model, Drawing, Document, Report',
        'Format options: IFC, DWG, PDF, XLSX',
        'LOI Level options: LOD 100, LOD 200, LOD 300, LOD 350, LOD 400',
        'Status options: Planned, In Progress, Completed, Delayed'
      ]
    };
  }

  /**
   * Create server-side TIDP directly (for external integrations)
   * @param {Object} tidpData - TIDP data from external source
   * @returns {Object} Created TIDP
   */
  createServerTIDP(tidpData) {
    // Enhanced validation for server-side creation
    if (!tidpData.teamName || tidpData.teamName.trim().length < 2) {
      throw new Error('Team name is required and must be at least 2 characters');
    }

    if (!tidpData.discipline) {
      throw new Error('Discipline is required');
    }

    const validDisciplines = ['architecture', 'structural', 'mep', 'civil', 'general'];
    if (!validDisciplines.includes(tidpData.discipline.toLowerCase())) {
      throw new Error(`Invalid discipline. Must be one of: ${validDisciplines.join(', ')}`);
    }

    return this.createTIDP({
      ...tidpData,
      source: 'server',
      createdVia: 'api'
    });
  }

  // ── ISO 19650 Suitability Code Transition Validation ──────────────────
  // Valid suitability codes per ISO 19650-1 Annex A
  static SUITABILITY_CODES = {
    'S0': { label: 'Work in Progress', order: 0 },
    'S1': { label: 'Fit for coordination', order: 1 },
    'S2': { label: 'Fit for information', order: 2 },
    'S3': { label: 'Fit for review & comment', order: 3 },
    'S4': { label: 'Fit for stage approval', order: 4 },
    'S5': { label: 'Fit for construction', order: 5 },
    'S6': { label: 'Fit for PIM authorization', order: 6 },
    'S7': { label: 'Fit for AIM authorization', order: 7 }
  };

  // Allowed transitions: generally forward progression, S0 can restart from any
  static VALID_TRANSITIONS = {
    'S0': ['S1', 'S2', 'S3'],
    'S1': ['S0', 'S2', 'S3'],
    'S2': ['S0', 'S3', 'S4'],
    'S3': ['S0', 'S4', 'S5'],
    'S4': ['S0', 'S5', 'S6'],
    'S5': ['S0', 'S6', 'S7'],
    'S6': ['S0', 'S7'],
    'S7': ['S0']
  };

  /**
   * Validate an ISO 19650 suitability code transition
   * @param {string} currentCode - Current suitability code (e.g. 'S1')
   * @param {string} newCode - Proposed new suitability code
   * @returns {{ valid: boolean, reason?: string }}
   */
  validateSuitabilityTransition(currentCode, newCode) {
    // Extract code prefix (S0-S7) from full review process string
    const extractCode = (str) => {
      if (!str) return null;
      const match = str.match(/^S(\d)/);
      return match ? `S${match[1]}` : null;
    };

    const current = extractCode(currentCode);
    const next = extractCode(newCode);

    if (!next || !TIDPService.SUITABILITY_CODES[next]) {
      return { valid: false, reason: `Invalid suitability code: ${newCode}` };
    }

    // If no current code, any valid code is allowed
    if (!current) {
      return { valid: true };
    }

    if (!TIDPService.SUITABILITY_CODES[current]) {
      return { valid: true }; // Unknown current code, allow transition
    }

    const allowed = TIDPService.VALID_TRANSITIONS[current] || [];
    if (current === next) {
      return { valid: true }; // Same code is always valid
    }

    if (!allowed.includes(next)) {
      return {
        valid: false,
        reason: `Invalid transition from ${current} (${TIDPService.SUITABILITY_CODES[current].label}) to ${next} (${TIDPService.SUITABILITY_CODES[next].label}). Allowed: ${allowed.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate suitability transitions for all containers in a TIDP update
   * @param {string} tidpId - TIDP ID
   * @param {Array} newContainers - Updated containers
   * @returns {{ valid: boolean, violations: Array }}
   */
  validateContainerSuitabilityTransitions(tidpId, newContainers) {
    const existing = this.getTIDP(tidpId);
    const existingMap = new Map();
    (existing.containers || []).forEach(c => {
      existingMap.set(c['Information Container ID'] || c.id, c['Review and Authorization Process']);
    });

    const violations = [];
    (newContainers || []).forEach(container => {
      const key = container['Information Container ID'] || container.id;
      const currentCode = existingMap.get(key);
      const newCode = container['Review and Authorization Process'];

      if (currentCode && newCode && currentCode !== newCode) {
        const result = this.validateSuitabilityTransition(currentCode, newCode);
        if (!result.valid) {
          violations.push({
            containerId: key,
            containerName: container['Information Container Name/Title'] || key,
            currentCode,
            newCode,
            reason: result.reason
          });
        }
      }
    });

    return { valid: violations.length === 0, violations };
  }
}

module.exports = new TIDPService();