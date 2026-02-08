# Model Benchmark Report
Generated: 2026-02-08 17:24:16

Models tested: llama3.2:3b, gemma3:4b, qwen3:4b

## Score Summary

| Model | Score | JSON | Speed | Quality |
|-------|-------|------|-------|---------|
| llama3.2:3b | **76.2/100** | — | — | — |
| gemma3:4b | **66.3/100** | — | — | — |
| qwen3:4b | **61.5/100** | — | — | — |

---
## Test 1: EIR JSON Analysis

### llama3.2:3b
- **JSON OK**: True
- **Pydantic OK**: True
- **Fields populated**: 10/13
- **Time**: 55.6s

<details>
<summary>Full JSON output (llama3.2:3b)</summary>

```json
{
  "project_info": {
    "name": "New Hospital Building - Phase 2",
    "description": null,
    "location": "Manchester, UK",
    "client": "NHS Trust",
    "project_type": "Healthcare",
    "estimated_value": "\u00a345 million"
  },
  "bim_objectives": [
    "Improve design coordination through clash detection",
    "Enable accurate quantity take-off for cost management",
    "Support facility management handover with COBie data",
    "Achieve BREEAM Excellent rating through sustainable design analysis"
  ],
  "information_requirements": {
    "OIR": [
      "Asset performance data for portfolio management"
    ],
    "AIR": [
      "Equipment specifications, maintenance schedules, warranty info"
    ],
    "PIR": [
      "Design coordination reports, cost estimates, programme updates"
    ],
    "EIR_specifics": [
      "LOD 300 minimum for all building elements at Stage 4"
    ]
  },
  "delivery_milestones": [
    {
      "phase": "Stage 3 Spatial Coordination",
      "description": "",
      "date": "March 2025"
    },
    {
      "phase": "Stage 4 Technical Design",
      "description": "",
      "date": "June 2025"
    },
    {
      "phase": "Construction Phase",
      "description": "",
      "date": "September 2025"
    },
    {
      "phase": "Practical Completion",
      "description": "",
      "date": "December 2026"
    }
  ],
  "standards_protocols": {
    "classification_systems": [
      "Uniclass 2015"
    ],
    "naming_conventions": "BS EN ISO 19650-2 compliant",
    "file_formats": [
      "IFC 2x3",
      "PDF",
      "DWG"
    ],
    "lod_loi_requirements": "As per UK BIM Framework",
    "cad_standards": null
  },
  "cde_requirements": {
    "platform": "BIM 360 Docs",
    "workflow_states": [
      "WIP",
      "Shared",
      "Published",
      "Archived"
    ],
    "access_control": "Role-based with project administrator oversight",
    "folder_structure": "Aligned with Uniclass 2015"
  },
  "roles_responsibilities": [
    {
      "role": "BIM Manager",
      "responsibilities": [
        "Overall BIM strategy, model coordination, standards compliance"
      ]
    },
    {
      "role": "Information Manager",
      "responsibilities": [
        "CDE administration, document control, access management"
      ]
    },
    {
      "role": "Lead Designer",
      "responsibilities": [
        "Design model production, clash resolution coordination"
      ]
    }
  ],
  "software_requirements": [
    "Autodesk Revit 2024",
    "Navisworks",
    "BIM 360",
    "Solibri Model Checker"
  ],
  "plain_language_questions": [],
  "quality_requirements": {
    "model_checking": "Weekly automated checks using Solibri",
    "clash_detection": "Bi-weekly coordination meetings with clash reports",
    "validation_procedures": "All models validated against EIR before sharing"
  },
  "handover_requirements": {
    "cobie_required": true,
    "asset_data": null,
    "documentation": [
      "COBie data",
      "As-built models in IFC format",
      "O&M manuals linked to asset data",
      "Training documentation for FM team"
    ]
  },
  "specific_risks": [],
  "other_requirements": []
}
```
</details>

### gemma3:4b
- **JSON OK**: True
- **Pydantic OK**: True
- **Fields populated**: 10/13
- **Time**: 49.8s

<details>
<summary>Full JSON output (gemma3:4b)</summary>

```json
{
  "project_info": {
    "name": "New Hospital Building - Phase 2",
    "description": null,
    "location": "Manchester, UK",
    "client": "NHS Trust",
    "project_type": "Healthcare",
    "estimated_value": "\u00a345 million"
  },
  "bim_objectives": [
    "Improve design coordination through clash detection",
    "Enable accurate quantity take-off for cost management",
    "Support facility management handover with COBie data",
    "Achieve BREEAM Excellent rating through sustainable design analysis"
  ],
  "information_requirements": {
    "OIR": [
      "Asset performance data for portfolio management"
    ],
    "AIR": [
      "Equipment specifications, maintenance schedules, warranty info"
    ],
    "PIR": [
      "Design coordination reports, cost estimates, programme updates"
    ],
    "EIR_specifics": [
      "LOD 300 minimum for all building elements at Stage 4"
    ]
  },
  "delivery_milestones": [
    {
      "phase": "Stage 3 Spatial Coordination",
      "description": "",
      "date": "March 2025"
    },
    {
      "phase": "Stage 4 Technical Design",
      "description": "",
      "date": "June 2025"
    },
    {
      "phase": "Construction Phase",
      "description": "",
      "date": "September 2025"
    },
    {
      "phase": "Practical Completion",
      "description": "",
      "date": "December 2026"
    }
  ],
  "standards_protocols": {
    "classification_systems": [
      "Uniclass 2015"
    ],
    "naming_conventions": "BS EN ISO 19650-2 compliant",
    "file_formats": [
      "IFC 2x3",
      "PDF",
      "DWG"
    ],
    "lod_loi_requirements": "As per UK BIM Framework",
    "cad_standards": null
  },
  "cde_requirements": {
    "platform": "BIM 360 Docs",
    "workflow_states": [
      "WIP",
      "Shared",
      "Published",
      "Archived"
    ],
    "access_control": "Role-based with project administrator oversight",
    "folder_structure": "Aligned with Uniclass 2015"
  },
  "roles_responsibilities": [
    {
      "role": "BIM Manager",
      "responsibilities": [
        "Overall BIM strategy, model coordination, standards compliance",
        "Clash resolution coordination"
      ]
    },
    {
      "role": "Information Manager",
      "responsibilities": [
        "CDE administration, document control, access management"
      ]
    },
    {
      "role": "Lead Designer",
      "responsibilities": [
        "Design model production"
      ]
    }
  ],
  "software_requirements": [
    "Autodesk Revit 2024",
    "Navisworks",
    "BIM 360",
    "Solibri Model Checker"
  ],
  "plain_language_questions": [],
  "quality_requirements": {
    "model_checking": "Weekly automated checks using Solibri",
    "clash_detection": "Bi-weekly coordination meetings with clash reports",
    "validation_procedures": "All models validated against EIR before sharing"
  },
  "handover_requirements": {
    "cobie_required": true,
    "asset_data": null,
    "documentation": [
      "COBie data",
      "As-built models in IFC format",
      "O&M manuals linked to asset data",
      "Training documentation for FM team"
    ]
  },
  "specific_risks": [],
  "other_requirements": []
}
```
</details>

### qwen3:4b
- **JSON OK**: True
- **Pydantic OK**: True
- **Fields populated**: 10/13
- **Time**: 47.1s

<details>
<summary>Full JSON output (qwen3:4b)</summary>

```json
{
  "project_info": {
    "name": "New Hospital Building - Phase 2",
    "description": null,
    "location": "Manchester, UK",
    "client": "NHS Trust",
    "project_type": "Healthcare",
    "estimated_value": "\u00a345 million"
  },
  "bim_objectives": [
    "Improve design coordination through clash detection",
    "Enable accurate quantity take-off for cost management",
    "Support facility management handover with COBie data",
    "Achieve BREEAM Excellent rating through sustainable design analysis"
  ],
  "information_requirements": {
    "OIR": [
      "Asset performance data for portfolio management"
    ],
    "AIR": [
      "Equipment specifications, maintenance schedules, warranty info"
    ],
    "PIR": [
      "Design coordination reports, cost estimates, programme updates"
    ],
    "EIR_specifics": [
      "LOD 300 minimum for all building elements at Stage 4"
    ]
  },
  "delivery_milestones": [
    {
      "phase": "Stage 3 Spatial Coordination",
      "description": "",
      "date": "March 2025"
    },
    {
      "phase": "Stage 4 Technical Design",
      "description": "",
      "date": "June 2025"
    },
    {
      "phase": "Construction Phase",
      "description": "",
      "date": "September 2025"
    },
    {
      "phase": "Practical Completion",
      "description": "",
      "date": "December 2026"
    }
  ],
  "standards_protocols": {
    "classification_systems": [
      "Uniclass 2015"
    ],
    "naming_conventions": "BS EN ISO 19650-2 compliant",
    "file_formats": [
      "IFC 2x3",
      "PDF",
      "DWG"
    ],
    "lod_loi_requirements": "As per UK BIM Framework",
    "cad_standards": null
  },
  "cde_requirements": {
    "platform": "BIM 360 Docs",
    "workflow_states": [
      "WIP",
      "Shared",
      "Published",
      "Archived"
    ],
    "access_control": "Role-based with project administrator oversight",
    "folder_structure": "Aligned with Uniclass 2015"
  },
  "roles_responsibilities": [
    {
      "role": "BIM Manager",
      "responsibilities": [
        "Overall BIM strategy, model coordination, standards compliance"
      ]
    },
    {
      "role": "Information Manager",
      "responsibilities": [
        "CDE administration, document control, access management"
      ]
    },
    {
      "role": "Lead Designer",
      "responsibilities": [
        "Design model production, clash resolution coordination"
      ]
    }
  ],
  "software_requirements": [
    "Autodesk Revit 2024",
    "Navisworks",
    "BIM 360",
    "Solibri Model Checker"
  ],
  "plain_language_questions": [],
  "quality_requirements": {
    "model_checking": "Weekly automated checks using Solibri",
    "clash_detection": "Bi-weekly coordination meetings with clash reports",
    "validation_procedures": "All models validated against EIR before sharing"
  },
  "handover_requirements": {
    "cobie_required": true,
    "asset_data": null,
    "documentation": [
      "COBie data",
      "As-built models in IFC format",
      "O&M manuals linked to asset data",
      "Training documentation for FM team"
    ]
  },
  "specific_risks": [],
  "other_requirements": []
}
```
</details>

---
## Test 2: Question Generation

### llama3.2:3b
- **JSON OK**: True
- **Questions count**: 4
- **Time**: 13.0s

**Generated questions:**

1. [?] What is the primary purpose of the project (e.g., construction, maintenance, upgrade)?
2. [?] Who are the key stakeholders involved in the project (e.g., building owner, architects, engineers, contractors)?
3. [?] Can you provide a brief summary of the project's scope, including any specific objectives or deliverables?
4. [?] Are there any unique project characteristics (e.g., historic building, complex geometry, multiple materials) that may impact the project's BIM execution plan?

### gemma3:4b
- **JSON OK**: True
- **Questions count**: 4
- **Time**: 15.9s

**Generated questions:**

1. [?] Can you provide a detailed description of the project's primary goals and objectives, referencing specific performance criteria or key performance indicators (KPIs) that will be used to measure project success?
2. [?] Please outline the scope of the BIM implementation, specifying which project phases (e.g., design, construction, handover) will be covered and the level of BIM maturity expected at each stage.
3. [?] What are the key stakeholders involved in the project, and what are their specific BIM-related roles and responsibilities as defined within the project organization structure?
4. [?] Describe the project’s overall delivery methodology (e.g., Design-Build, Design-Bid-Build) and how this methodology will influence the BIM execution strategy and collaboration processes.

### qwen3:4b
- **JSON OK**: True
- **Questions count**: 3
- **Time**: 37.8s

**Generated questions:**

1. [?] What are the key objectives for Project Description?
2. [?] What is the project type and scale?
3. [?] Are there specific standards or requirements to address?

---
## Test 3: BEP Content Generation (field: bimObjectives)

### llama3.2:3b
- **Length**: 1158 chars
- **Clean** (no AI preamble): True
- **Time**: 7.8s

**Full generated text:**

```
Information Management Principles for BIM Documentation

The use of Building Information Modelling (BIM) has transformed the construction industry, enabling architects, engineers, contractors, and owners to work together more effectively and efficiently. However, with the increased reliance on digital models, it is essential to establish robust information management principles to ensure that all stakeholders have access to accurate and consistent data.

ISO 19650 provides a framework for managing information in the construction industry, emphasizing the importance of collaboration, data quality, and security. The following guidelines outline best practices for BIM documentation:

| Document Type | Description | Purpose | Audience |
| --- | --- | --- | --- |
| Family Definition | Defines the characteristics of a building product or component | Establishes consistency across the project team | All stakeholders |
| 3D Model | Digital representation of the physical and functional elements of a building | Provides a common data environment for collaboration | Project team members |
| 2D Plans | Visual representation of the building's layout and
```

### gemma3:4b
- **Length**: 758 chars
- **Clean** (no AI preamble): False
- **Time**: 10.0s

**Full generated text:**

```
Here's a BIM documentation content section designed to align with industry best practices and ISO 19650 principles, presented as an HTML table. This focuses on a typical "Model Information" section, crucial for managing BIM data effectively.

```html
<table>
<thead>
<tr>
<th>Item ID</th>
<th>Item Name</th>
<th>Description</th>
<th>Version</th>
<th>Owner</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td>MI-001</td>
<td>Model Information Document</td>
<td>This document details the overall information management strategy for the BIM project, referencing relevant standards and protocols.</td>
<td>1.0</td>
<td>BIM Manager - Sarah Jones</td>
<td>Active</td>
</tr>
<tr>
<td>MI-002</td>
<td>Model Governance Plan</td>
<td>Outlines roles, responsibilities,
```

### qwen3:4b
- **Length**: 41 chars
- **Clean** (no AI preamble): True
- **Time**: 8.8s

**Full generated text:**

```
Please provide more context or try again.
```
