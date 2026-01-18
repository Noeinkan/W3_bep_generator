# BIM Execution Plan (BEP) Suite

A comprehensive, professional-grade platform for generating BIM Execution Plans (BEPs) and managing information delivery in accordance with ISO 19650 standards. This suite provides construction and BIM professionals with end-to-end tools for planning, coordinating, and delivering information throughout the building lifecycle.

## Overview

The BEP Suite consists of two integrated products:

1. **BEP Generator** - Creates ISO 19650-compliant BIM Execution Plans with intelligent form wizards, AI-powered content suggestions, and professional export capabilities.

2. **TIDP/MIDP Manager** - Manages Task Information Delivery Plans (TIDPs) and automatically generates Master Information Delivery Plans (MIDPs) with full project coordination, dependency tracking, and team collaboration features.

## Key Features

### BEP Generator
- **Interactive Multi-Step Wizard** - Guided BEP creation process with progress tracking
- **Two BEP Types** - Support for both pre-appointment and post-appointment BEPs
- **AI-Powered Content Generation** - ML-based text suggestions for all BEP sections
- **Rich Text Editing** - Professional TipTap editor with formatting, tables, images, and more
- **Professional Templates** - Pre-built ISO 19650-compliant templates
- **Draft Management** - Save, load, and manage multiple drafts
- **Export Capabilities** - High-quality PDF and DOCX exports
- **Visual Builders** - Interactive diagrams for CDE workflows, folder structures, org charts
- **Context-Sensitive Help** - Field-level tooltips and guidance
- **Command Palette** - Quick navigation (Cmd+K style interface)
- **Onboarding System** - Interactive tutorials for new users

### TIDP/MIDP Manager
- **Task Information Delivery Plan (TIDP) Creation** - Comprehensive TIDP editor with container management
- **Master Information Delivery Plan (MIDP) Auto-Generation** - Automatically consolidates TIDPs into MIDPs
- **Multi-Team Collaboration** - Coordinate information delivery across multiple teams
- **Excel/CSV Import** - Bulk import TIDPs from spreadsheets
- **Dependency Tracking** - Visualize and manage deliverable dependencies
- **Resource Allocation** - Track team resources and workload
- **Evolution Dashboard** - Monitor TIDP/MIDP progress over time
- **Responsibility Matrix** - ISO 19650 Information Management Activities and Deliverables matrices
- **Quality Gates** - Validation checks and acceptance criteria
- **Risk Register** - Identify and manage information delivery risks
- **Consolidated Exports** - Export entire project data to Excel or PDF
- **TIDP Synchronization** - Auto-populate information from TIDPs to responsibility matrices

### Advanced Features
- **Interactive Visualizations** - Node-based diagrams using @xyflow/react
- **RACI Matrix Builder** - Define roles and responsibilities
- **Naming Convention Builder** - Create consistent file naming patterns
- **Timeline & Gantt Charts** - Project schedule visualization
- **Deliverable Attributes Visualizer** - Comprehensive deliverable properties
- **Mind Map Builder** - Visual information structure planning
- **Project Analytics** - Statistics and progress tracking
- **Real-Time Validation** - ISO 19650 compliance checking
- **Batch Operations** - Bulk create, update, and delete TIDPs
- **Dependency Matrix** - Cross-team dependency visualization

## Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **React Router DOM 7.9.3** - Client-side routing
- **TipTap 3.6.2** - Rich text editor with extensive extensions
- **@xyflow/react 12.8.6** - Interactive node-based diagrams
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React 0.544.0** - Beautiful icon library
- **Axios 1.12.2** - HTTP client
- **D3.js 7.9.0** - Data visualization

### Backend
- **Node.js + Express** - RESTful API server (Port 3001)
- **SQLite** (better-sqlite3 12.4.1) - Lightweight database
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### ML/AI Service
- **Ollama** - Local LLM runtime (llama3.2:3b model)
- **Python 3.8+** - ML runtime environment
- **FastAPI 0.104.1+** - High-performance API server (Port 8000)
- **Uvicorn** - ASGI server
- **PyTorch 2.6.0+** - Deep learning framework (optional, for custom training)
- **NumPy** - Numerical computing

### Export Libraries
- **jsPDF 3.0.3** - PDF generation
- **html2pdf.js 0.12.1** - HTML to PDF conversion
- **html2canvas 1.4.1** - Screenshot capture
- **docx 9.5.1** - Word document generation
- **xlsx 0.18.5** - Excel file handling
- **PapaParse 5.5.3** - CSV parsing

## Architecture

The application follows a modern three-tier architecture:

1. **Frontend Layer** - React SPA with 99+ modular components
2. **Backend API Layer** - Express REST API with SQLite persistence
3. **ML Service Layer** - Python FastAPI service for AI text generation

### Database Schema

**Main Tables:**
- `tidps` - Task Information Delivery Plans
- `containers` - TIDP deliverable containers
- `midps` - Master Information Delivery Plans
- `information_management_activities` - ISO 19650 IM activities
- `information_deliverables` - Information deliverables with TIDP linkage

## AI Text Generation

The ML service uses **Ollama** with the **llama3.2:3b** model for high-quality, context-aware text generation.

### Features
- **Local LLM** - Runs entirely on your machine via Ollama
- Temperature-based sampling for creative control
- Field-specific prompts for 24+ BEP field types
- Fast inference with low latency
- No internet connection required after setup
- Support for multiple Ollama models (configurable via environment)

### Ollama Setup
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the model:
```bash
ollama pull llama3.2:3b
```
3. Verify installation:
```bash
npm run verify:ollama
```

### Supported Field Types
- Executive summary, project objectives, BIM objectives
- Stakeholders, roles & responsibilities, delivery team
- Collaboration procedures, information exchange protocols
- CDE workflow, model requirements, data standards
- Naming conventions, quality assurance, validation checks
- Technology standards, software platforms, coordination process
- Health & safety, handover requirements, COBie requirements
- And many more...

## API Endpoints

### TIDP Routes (`/api/tidp`)
- `GET /tidp` - Get all TIDPs
- `GET /tidp/:id` - Get specific TIDP
- `POST /tidp` - Create TIDP
- `PUT /tidp/:id` - Update TIDP
- `DELETE /tidp/:id` - Delete TIDP
- `POST /tidp/batch` - Batch create TIDPs
- `POST /tidp/import/excel` - Import from Excel
- `POST /tidp/import/csv` - Import from CSV
- `GET /tidp/project/:projectId/dependency-matrix` - Dependency visualization

### MIDP Routes (`/api/midp`)
- `GET /midp` - Get all MIDPs
- `POST /midp/from-tidps` - Create MIDP from TIDPs
- `POST /midp/auto-generate/:projectId` - Auto-generate MIDP
- `PUT /midp/:id/update-from-tidps` - Update from TIDPs
- `GET /midp/:id/evolution` - Evolution dashboard data
- `GET /midp/:id/deliverables-dashboard` - Deliverables overview
- `GET /midp/:id/risk-register` - Risk register
- `GET /midp/:id/dependency-matrix` - Dependency matrix
- `POST /midp/:id/refresh` - Refresh MIDP from TIDPs

### Responsibility Matrix Routes (`/api/responsibility-matrix`)
- `GET/POST/PUT/DELETE /im-activities` - Information management activities
- `GET/POST/PUT/DELETE /deliverables` - Information deliverables
- `POST /sync-tidps` - Synchronize with TIDPs
- `GET /sync-status` - Get synchronization status

### Export Routes (`/api/export`)
- `POST /tidp/:id/excel` - Export TIDP to Excel
- `POST /tidp/:id/pdf` - Export TIDP to PDF
- `POST /midp/:id/excel` - Export MIDP to Excel
- `POST /midp/:id/pdf` - Export MIDP to PDF
- `POST /responsibility-matrix/excel` - Export matrices to Excel
- `POST /project/:projectId/consolidated-excel` - Consolidated project export

### Validation Routes (`/api/validation`)
- `POST /tidp/:id` - Validate TIDP
- `POST /midp/:id` - Validate MIDP
- `POST /project/:projectId/comprehensive` - Comprehensive validation
- `GET /standards/iso19650` - Get ISO 19650 standards

### ML Service Routes (Port 8000)
- `POST /generate` - Generate text from prompt
- `POST /suggest` - Field-specific suggestions
- `GET /health` - Health check

## Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm** or yarn
- **(Optional) Ollama** for AI text generation features - [Download](https://ollama.ai)
- **(Optional) Python 3.8+** for running the ML service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bep-generator
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **(Optional) Set up AI text generation with Ollama**

   Install Ollama:
   - Download from [ollama.ai](https://ollama.ai)
   - Run the installer

   Pull the required model:
   ```bash
   ollama pull llama3.2:3b
   ```

   Create Python virtual environment for the API:
   ```bash
   cd ml-service
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

   Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Full Stack with AI (Recommended)

**Single command (starts everything):**
```bash
npm start
```
This automatically starts:
- React frontend at [http://localhost:3000](http://localhost:3000)
- Express backend at [http://localhost:3001](http://localhost:3001)
- ML service with Ollama at [http://localhost:8000](http://localhost:8000)
- Ollama server (if not already running)

**Note:** Ensure Ollama is installed and the model is pulled before running.

#### Option 2: Frontend & Backend Only (Without AI)

```bash
npm start
```
The application will work without AI features, but text generation will not be available.

#### Windows Quick Start

```bash
bep-generator.bat
```
This launches both the main application and ML service.

### Available Scripts

#### Frontend & Backend

- **`npm start`** - Runs frontend (3000) and backend (3001) in development mode
- **`npm test`** - Launches test runner in interactive watch mode
- **`npm run build`** - Builds production-ready app to `build` folder (8GB memory allocation)
- **`npm run eject`** - Ejects from Create React App (one-way operation)

#### ML Service

- **`npm run start:ml`** - Start the FastAPI ML service with Ollama
- **`npm run verify:ollama`** - Verify Ollama installation and model availability
- **`npm run start:ollama`** - Start Ollama server manually

## Project Structure

```
bep-generator/
├── src/                          # React frontend source
│   ├── components/               # React components (99+ files)
│   │   ├── auth/                # Authentication components
│   │   ├── forms/               # Form controls and specialized editors
│   │   ├── pages/               # Main application pages
│   │   ├── layout/              # Layout components
│   │   ├── steps/               # Multi-step wizard components
│   │   └── ...
│   ├── services/                # API and export services
│   ├── contexts/                # React context providers
│   ├── utils/                   # Utility functions
│   └── constants/               # Configuration constants
├── server/                      # Node.js backend
│   ├── server.js               # Express server entry point
│   ├── app.js                  # Express app configuration
│   ├── routes/                 # API route handlers
│   │   ├── tidp.js            # TIDP routes
│   │   ├── midp.js            # MIDP routes
│   │   ├── export.js          # Export routes
│   │   ├── validation.js      # Validation routes
│   │   └── ...
│   └── db/                     # Database
│       └── bep-generator.db    # SQLite database file
├── ml-service/                  # Python ML service
│   ├── api_ollama.py           # FastAPI server with Ollama integration
│   ├── ollama_generator.py     # Ollama text generation logic
│   ├── models/                 # Model configurations
│   ├── data/                   # BEP templates and examples
│   ├── verify_ollama.py        # Ollama installation verification
│   └── requirements.txt        # Python dependencies
├── public/                      # Static assets
├── data/                        # Training data
│   └── training_data.txt       # ML training corpus
├── scripts/                     # Build and utility scripts
├── package.json                # Node dependencies and scripts
├── tailwind.config.js          # TailwindCSS configuration
└── README.md                   # This file
```

## Documentation

For detailed information about BIM concepts and technical implementation:

- [TIDP and MIDP Relationship](TIDP_MIDP_Relationship.md) - Understanding Task and Master Information Delivery Plans in ISO 19650 context

## ISO 19650 Compliance

This application implements the following ISO 19650-2:2018 requirements:

- **Clause 5.1** - Information management process
- **Clause 5.3** - Information requirements
- **Clause 5.4** - Information delivery planning
- **Clause 5.6** - Information production methods and procedures
- **Clause 5.7** - Common Data Environment (CDE)
- **Annex A** - Responsibility matrices for information management
- **TIDP/MIDP Framework** - Complete implementation of task and master planning

## Features in Detail

### BEP Generator Workflow
1. Select BEP type (pre-appointment/post-appointment)
2. Fill project information and objectives
3. Define team structure and responsibilities
4. Configure CDE and information exchange protocols
5. Set naming conventions and standards
6. Define quality assurance procedures
7. Preview and export to PDF/DOCX

### TIDP/MIDP Workflow
1. Create TIDPs for each task team
2. Define deliverable containers with attributes
3. Set dependencies and LOINs
4. Auto-generate MIDP from TIDPs
5. Manage responsibility matrices
6. Track evolution and progress
7. Export consolidated project data

### Command Palette
Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) to:
- Quick navigate to sections
- Search for fields
- Access help documentation
- Open export options

## Export Formats

### PDF Export
- Professional layout with headers/footers
- Table of contents with page numbers
- Embedded images and diagrams
- ISO 19650 compliant formatting

### DOCX Export
- Microsoft Word format
- Fully editable documents
- Preserved formatting and styles
- Compatible with Word 2016+

### Excel Export
- Comprehensive project data
- Multiple worksheets for different aspects
- Formulas and conditional formatting
- Import/export templates

## Security Features

- Helmet.js security headers
- CORS protection
- Rate limiting on API endpoints
- Input sanitization with DOMPurify
- SQL injection prevention
- XSS protection

## Performance Optimizations

- Code splitting for faster initial load
- Lazy loading of components
- Memoization of expensive computations
- Virtual scrolling for large lists
- Optimized bundle size with tree shaking
- Database indexing for fast queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `build` folder with:
- Minified JavaScript and CSS
- Hashed filenames for caching
- Optimized images and assets
- Source maps for debugging

### Deployment

1. Build the frontend: `npm run build`
2. Serve static files from `build` directory
3. Run backend server: `node server/server.js`
4. (Optional) Run ML service: `cd ml-service && python api.py`
5. Configure reverse proxy (nginx/Apache) for production
6. Set environment variables:
   - `NODE_ENV=production`
   - Configure CORS for production domain
   - Set database path if needed

## System Requirements

### Minimum Requirements
- **CPU:** Dual-core processor
- **RAM:** 4GB (8GB recommended)
- **Storage:** 500MB free space
- **Internet:** For initial setup only

### Recommended for AI Features
- **CPU:** Quad-core processor or better
- **RAM:** 8GB (16GB recommended for optimal performance)
- **Storage:** 5GB free space (for Ollama and models)
- **Ollama:** Latest version with llama3.2:3b model (~2GB)

## Troubleshooting

### Port Already in Use
If port 3000, 3001, or 8000 is already in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Locked
If you get "database is locked" errors:
- Close all connections to the database
- Restart the backend server
- Check file permissions on `server/db/bep-generator.db`

### ML Service Not Starting
- Verify Ollama is installed and running: `ollama list`
- Verify the model is available: `ollama pull llama3.2:3b`
- Verify Python 3.8+ is installed: `python --version`
- Check all dependencies are installed: `pip install -r ml-service/requirements.txt`
- Ensure virtual environment is activated
- Check if port 8000 is available
- Run verification: `npm run verify:ollama`

### Build Fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall dependencies: `npm install`
- Ensure you have 8GB+ RAM available

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For issues, questions, or feature requests, please contact the development team or create an issue in the repository.

## Acknowledgments

- **ISO 19650** - International standards for information management using BIM
- **Create React App** - React development environment
- **TipTap** - Excellent rich text editor framework
- **PyTorch** - Deep learning framework for AI capabilities
- **FastAPI** - Modern Python web framework for ML API

## Learn More

### React Resources
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

### BIM Standards
- [ISO 19650-1:2018](https://www.iso.org/standard/68078.html) - Concepts and principles
- [ISO 19650-2:2018](https://www.iso.org/standard/68080.html) - Delivery phase of assets
- [UK BIM Framework](https://www.ukbimframework.org/) - Practical guidance

### Machine Learning
- [Ollama Documentation](https://ollama.ai/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Llama 3.2 Model Info](https://ollama.ai/library/llama3.2)

---

**Version:** 2.0.0
**Last Updated:** January 2026
**Developed with:** React, Node.js, Python, and Ollama
