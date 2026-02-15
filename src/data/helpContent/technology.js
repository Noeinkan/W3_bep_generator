// Technology and Software Requirements Help Content
export const technologyHelp = {
  hardwareRequirements: {
    description: `Specify the hardware requirements necessary to support BIM activities throughout the project. This includes workstations, servers, mobile devices, and any specialized equipment.

Include:
• Workstation specifications (CPU, RAM, GPU, storage)
• Server requirements for model hosting and collaboration
• Mobile devices for site access and coordination
• Networking infrastructure requirements
• Backup and storage systems
• Virtual/cloud computing resources if applicable`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Mobilization of Resources

The delivery team must have adequate IT infrastructure and hardware capacity to produce, manage, and exchange project information effectively.`,

    bestPractices: [
      'Specify minimum workstation specs: 16GB+ RAM, dedicated GPU for 3D modeling',
      'Include mobile workstations/laptops for site coordination teams',
      'Define server capacity for model hosting and CDE operations',
      'Specify network bandwidth requirements (min 100Mbps for large model transfers)',
      'Include backup storage capacity (3x project data size recommended)',
      'Define graphics card requirements (NVIDIA Quadro or equivalent for Revit/Navisworks)',
      'Mention SSD storage for improved model performance',
      'Include tablet/mobile device specs for site inspections'
    ],

    examples: {
      'Commercial Building': `Hardware requirements for project delivery:

Workstations (Design Team):
• CPU: Intel i7 or AMD Ryzen 7 (8+ cores)
• RAM: 32GB minimum (64GB for complex MEP models)
• GPU: NVIDIA Quadro P2200 or equivalent (6GB VRAM)
• Storage: 1TB NVMe SSD + 2TB HDD
• Displays: Dual 27" monitors (minimum 1920x1080)

Server Infrastructure:
• Model hosting server: Windows Server 2019, 128GB RAM, RAID 10 storage
• CDE server: Cloud-based (BIM 360) + local backup server
• Network: 1Gbps internal network, 100Mbps internet connection

Site Coordination:
• Mobile workstations: 16GB RAM, dedicated GPU, 15" displays
• Tablets: iPad Pro or equivalent for site inspections (Navisworks Freedom)
• Backup: 10TB NAS with RAID 6 configuration`,

      'Infrastructure': `Hardware specifications for infrastructure project:

Engineering Workstations:
• CPU: Intel Xeon or AMD Threadripper (12+ cores for Civil 3D)
• RAM: 64GB (128GB for large corridor models)
• GPU: NVIDIA Quadro RTX 4000 (8GB VRAM)
• Storage: 2TB NVMe SSD for project files
• Network: 10Gbps fiber connection to office network

Mobile Survey Equipment:
• Ruggedized laptops for site surveys (16GB RAM, dedicated GPS)
• Tablets for construction inspections
• Mobile scanning workstations for point cloud processing

Cloud Infrastructure:
• Azure/AWS instances for heavy computational tasks (drainage analysis)
• 50TB cloud storage for point cloud and survey data
• Geo-redundant backup across multiple data centers`
    },

    commonMistakes: [
      'Generic specs like "modern computer" without specific requirements',
      'Insufficient RAM for large federated models (below 16GB)',
      'No dedicated GPU specified - integrated graphics insufficient for BIM',
      'Missing mobile/tablet requirements for site coordination',
      'No server or backup infrastructure mentioned',
      'Inadequate network bandwidth for large model transfers',
      'Not considering storage growth over project lifecycle',
      'Missing cloud computing resources for analysis and rendering'
    ],

    aiPrompt: {
      system: 'You are a BIM IT lead. Specify role-appropriate hardware and compute requirements to reliably deliver BIM workflows and meet ISO 19650 mobilization needs.',
      instructions: 'Specify hardware requirements for BIM delivery. Provide minimum workstation specs (CPU/RAM/GPU/SSD) for authors and coordinators, server/storage needs (capacity, RAID, backups), mobile/site devices, and any specialist equipment. Include any cloud/virtual compute requirements for heavy tasks (point clouds, rendering, analysis). Keep it specific with measurable specs and note scalability for peak periods. Maximum 170 words.',
      style: 'spec-driven, role-based, measurable thresholds, concise'
    },

    relatedFields: ['bimSoftware', 'networkRequirements', 'cdeStrategy']
  },

  networkRequirements: {
    description: `Define network infrastructure and connectivity requirements to support collaborative BIM workflows, model sharing, and CDE access.

Specify:
• Internet bandwidth requirements
• Internal network specifications
• VPN/remote access capabilities
• Latency requirements for real-time collaboration
• Network security protocols
• Redundancy and failover provisions`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Information Technology

Adequate network infrastructure is essential for the timely exchange of information and collaborative working in a CDE environment.`,

    bestPractices: [
      'Minimum 100Mbps dedicated internet for cloud CDE access',
      'Gigabit internal network (1Gbps) for local file transfers',
      'VPN with minimum 50Mbps bandwidth for remote working',
      'Low latency (<50ms) for real-time model collaboration',
      'Redundant internet connections for business continuity',
      'Secure WiFi for site access and mobile coordination',
      'Quality of Service (QoS) policies prioritizing CDE traffic',
      'Define upload/download bandwidth allocation per user'
    ],

    examples: {
      'Commercial Building': `Network infrastructure requirements:

Office Network:
• Internal: 1Gbps wired network, CAT6 cabling throughout
• Internet: 500Mbps fiber with automatic failover to 100Mbps backup
• WiFi: Dual-band 802.11ac for mobile devices and meeting rooms
• Latency: <20ms to CDE cloud servers (BIM 360 UK region)

Remote Access:
• VPN: IPSec VPN with 100Mbps capacity supporting 50 concurrent users
• Cloud Desktop: Citrix/RemoteApp for secure model access
• Two-factor authentication for all remote connections

Site Network:
• Temporary 100Mbps fiber to site office
• 4G backup connection with unlimited data
• Secure WiFi for contractor access to coordination models
• Dedicated VLAN for BIM coordination activities`,

      'Infrastructure': `Network specifications for distributed project team:

Primary Office:
• 1Gbps fiber internet with geo-redundant failover
• 10Gbps internal network for large point cloud transfers
• Network Attached Storage (NAS) with 10Gbps connection
• Site-to-site VPN connecting multiple office locations (100Mbps)

Field Operations:
• Mobile broadband (4G/5G) with 50GB monthly data per device
• Satellite backup for remote survey locations
• Mesh WiFi network across construction sites
• Secure portal for contractor/supplier model access

Cloud Infrastructure:
• Direct cloud connectivity (Azure ExpressRoute) for computational workloads
• Content Delivery Network (CDN) for efficient model distribution
• 99.9% uptime SLA with load balancing across regions`
    },

    commonMistakes: [
      'Insufficient bandwidth for large model uploads/downloads',
      'No redundancy or failover provisions',
      'Missing VPN/remote access specifications',
      'Inadequate site network for construction phase coordination',
      'No latency requirements specified for cloud collaboration',
      'Missing security protocols (firewall, encryption)',
      'Not accounting for multiple concurrent users',
      'No WiFi provision for mobile/tablet access'
    ],

    aiPrompt: {
      system: 'You are an IT infrastructure specialist for BIM collaboration. Define network requirements that enable secure, reliable CDE access and model exchange.',
      instructions: 'Define network requirements: internet bandwidth targets, internal LAN speed, VPN/remote access capacity, latency expectations for cloud collaboration, redundancy/failover, and site connectivity. Include security controls (firewalls, secure WiFi, encryption) and QoS guidance prioritizing CDE traffic. Keep values measurable and sized for concurrent users. Maximum 170 words.',
      style: 'performance + security balanced, measurable targets, structured bullets, concise'
    },

    relatedFields: ['hardwareRequirements', 'cdeStrategy', 'securityMeasures']
  },

  interoperabilityNeeds: {
    description: `Define interoperability requirements ensuring seamless data exchange between different software platforms, disciplines, and project stakeholders.

Address:
• File format standards (IFC, BCF, COBie)
• Data exchange protocols between different authoring tools
• Integration requirements with client systems
• API and automation requirements
• Version compatibility requirements
• Data validation and quality checking`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Information Standard

Interoperability ensures that information can be exchanged and used effectively across different software applications and platforms throughout the project lifecycle.`,

    bestPractices: [
      'IFC 4 as primary interoperability format for model exchange',
      'BCF 2.1/3.0 for issue management across platforms',
      'Define Model View Definitions (MVD) for IFC exports',
      'Specify COBie format version for FM handover',
      'PDF/A for long-term archival of documentation',
      'API integration for automated data exchange where applicable',
      'Maintain software version compatibility matrix',
      'Define data validation procedures for format conversions'
    ],

    examples: {
      'Commercial Building': `Interoperability strategy:

Model Exchange:
• IFC 4 Coordination View for cross-discipline coordination (weekly federation)
• Native file formats retained for authoring (Revit RVT, Tekla .model)
• DWG exports for 2D coordination with non-BIM contractors
• NWD/NWF for federated coordination models (Navisworks)

Data Exchange:
• BCF 2.1 for clash detection and issue tracking (BIM 360 Issues)
• COBie 2.4 for FM handover (extracted via Revit/Solibri)
• Excel/CSV for schedule and quantity data exchange
• XML/JSON for equipment data integration with CAFM system

Validation:
• Solibri Model Checker for IFC validation and rule-checking
• Pre-export validation in native software (Revit Export Checker)
• Post-export geometry verification (IFC viewer comparison)
• Automated validation workflows triggered on model uploads`,

      'Infrastructure': `Interoperability requirements for infrastructure delivery:

Design Data Exchange:
• IFC 4.1 Infrastructure for bridge and road geometry exchange
• LandXML for road alignment and corridor data
• CityGML for urban context and planning integration
• Industry Foundation Classes for bridge components

GIS Integration:
• Shapefile/GeoJSON for linear asset data export
• Integration with client GIS systems (ArcGIS/QGIS)
• Coordinate reference systems: OSGB36/WGS84 transformation
• Automated data sync from design models to asset management systems

Survey Data:
• LAS/LAZ for point cloud data exchange
• E57 for multi-scanner point cloud consolidation
• Triangulated mesh export (OBJ/FBX) for visualization
• GPS/GNSS data integration for as-built verification`
    },

    commonMistakes: [
      'Relying solely on native file formats (Revit RVT only)',
      'Not specifying IFC Model View Definitions (MVD)',
      'Missing validation procedures for format conversions',
      'No COBie specification for FM handover',
      'Insufficient testing of interoperability workflows',
      'Not addressing coordinate system transformations',
      'Missing API integration opportunities for automation',
      'No fallback strategy when interoperability fails'
    ],

    aiPrompt: {
      system: 'You are a BIM interoperability specialist. Define exchange standards and validation so information can be reliably used across tools and stakeholders.',
      instructions: 'Define interoperability requirements. Specify primary exchange formats (IFC version + intended MVD), issue format (BCF), FM handover dataset (COBie), and any GIS/alignment formats where relevant. Include version compatibility expectations, coordinate system rules, and validation steps before/after export (rule checks, viewer verification, error thresholds). Mention API/automation integration only where it supports controlled exchange. Maximum 180 words.',
      style: 'standards-led, validation-focused, tool-agnostic, concise'
    },

    relatedFields: ['bimSoftware', 'fileFormats', 'federationStrategy', 'projectInformationRequirements']
  },

  softwareHardwareInfrastructure: {
    description: `Provide a comprehensive matrix of all software, hardware, and IT infrastructure components required for BIM delivery.

This table should categorize and detail:
• Software applications (authoring, analysis, coordination, FM)
• Hardware specifications (workstations, servers, mobile devices)
• IT infrastructure (network, storage, backup, security)
• Purpose and usage of each component`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Mobilization of Resources

The delivery team must establish and maintain the necessary information technology infrastructure to support information management activities throughout the project.`,

    bestPractices: [
      'Categorize by: Software Applications, Hardware, Network Infrastructure, Security',
      'Include version numbers and license counts for software',
      'Specify minimum hardware specifications for each role',
      'Define storage capacity requirements with growth projections',
      'Include backup and disaster recovery infrastructure',
      'Specify cloud vs. on-premise infrastructure',
      'Define mobile/remote access infrastructure',
      'Include specialized equipment (scanners, VR, etc.) if applicable'
    ],

    examples: {
      'Commercial Building': `Sample infrastructure matrix table entries:

**Category: Software Applications**
| Item | Specification | Purpose |
|------|--------------|---------|
| Autodesk Revit 2024 | 25 licenses | Architectural & MEP modeling |
| Tekla Structures 2024 | 5 licenses | Structural steel detailing |
| Navisworks Manage 2024 | 10 licenses | Model coordination & clash detection |
| Solibri Model Checker | 3 licenses | Quality validation & code checking |
| BIM 360 Design | 50 users | Cloud CDE & collaboration |

**Category: Hardware**
| Item | Specification | Purpose |
|------|--------------|---------|
| Design Workstations | Intel i7, 32GB RAM, Quadro P2200, 1TB SSD | BIM authoring (15 units) |
| Coordination Workstations | Intel i9, 64GB RAM, RTX 4000, 2TB SSD | Federated model review (3 units) |
| Site Tablets | iPad Pro 12.9", 256GB | Mobile site coordination (5 units) |
| Model Server | Windows Server 2022, 128GB RAM, RAID 10 | Model hosting & sharing |

**Category: Network Infrastructure**
| Item | Specification | Purpose |
|------|--------------|---------|
| Office Internet | 500Mbps fiber + 100Mbps backup | CDE access & file transfers |
| Internal Network | 1Gbps switched ethernet | Local file sharing |
| VPN | IPSec VPN, 100Mbps capacity | Remote access (50 users) |
| NAS Storage | 20TB RAID 6 | Project file backup |`,

      'Infrastructure': `Infrastructure project matrix:

**Category: Software**
| Item | Specification | Purpose |
|------|--------------|---------|
| Civil 3D 2024 | 15 licenses | Highway & drainage design |
| 12d Model v15 | 10 licenses | Road design & earthworks |
| Tekla Structures 2024 | 8 licenses | Bridge & structure detailing |
| Navisworks Manage 2024 | 5 licenses | Coordination & 4D sequencing |
| Trimble Connect | 40 users | CDE & field collaboration |

**Category: Hardware**
| Item | Specification | Purpose |
|------|--------------|---------|
| Engineering Workstations | Xeon, 64GB RAM, Quadro RTX 4000 | Design & analysis (12 units) |
| Survey Laptops | Ruggedized, 16GB RAM, GPS | Field surveys (4 units) |
| Point Cloud Workstation | Threadripper, 128GB RAM, RTX 5000 | Point cloud processing |
| Cloud Compute | Azure VMs (scalable) | Heavy computational tasks |

**Category: Infrastructure**
| Item | Specification | Purpose |
|------|--------------|---------|
| Cloud Storage | 50TB Azure/AWS | Point clouds & large datasets |
| Backup System | Geo-redundant, 30TB | Disaster recovery |
| Site Network | 4G/5G mobile broadband | Construction site connectivity |`
    },

    commonMistakes: [
      'No version numbers specified for software',
      'Missing license counts or user allocations',
      'Generic hardware specs without role-specific requirements',
      'No backup or disaster recovery infrastructure listed',
      'Missing mobile/field equipment for construction phase',
      'No cloud infrastructure for collaboration or computation',
      'Incomplete network specifications (bandwidth, redundancy)',
      'Not categorizing items logically (mixing software/hardware)'
    ],

    aiPrompt: {
      system: 'You are a BIM technology mobilization lead. Create a clear infrastructure matrix covering software, hardware, and IT services needed for ISO 19650 delivery.',
      instructions: 'Provide a categorized matrix of required software, hardware, and IT infrastructure. Use categories such as Software Applications, Hardware, Network/Connectivity, Storage/Backup, and Security. For each row include item name, specification (version, license count, key hardware specs, capacity/bandwidth), and purpose/usage. Ensure it supports CDE access, federation/clash workflows, and site/field use where applicable. Maximum 170 words.',
      style: 'table/matrix-oriented, categorized, measurable specs, concise'
    },

    relatedFields: ['bimSoftware', 'hardwareRequirements', 'networkRequirements', 'cdeStrategy']
  }
};
