# S Chand AI Infrastructure - PRD

## Original Problem Statement
Build a Data Infrastructure product website for S Chand - similar to Infobay but focused on academic intelligence datasets for AI labs. The website should look like a serious AI infrastructure provider, not an edtech site.

## Architecture
- **Frontend**: React with Tailwind CSS, Framer Motion, Shadcn/UI components
- **Backend**: FastAPI with MongoDB
- **File Storage**: Local uploads directory with MongoDB metadata

## User Personas
1. **Frontier AI Labs** - Training next-gen LLMs with academic data
2. **EdTech Platforms** - Building AI tutors
3. **Research Institutions** - Developing reasoning models
4. **Foundation Model Companies** - Needing structured training corpora

## Core Requirements (Static)
- Dark theme professional AI infrastructure aesthetic
- Lead capture with immediate download
- Admin panel for file management
- Dataset product pages with detailed information
- Benchmark impact showcase

## What's Been Implemented (Dec 2024)

### Homepage
- Hero section with animated stats (2B+ samples, 15+ subjects, 12 languages, 2000+ annotators)
- "Why Us" section with 6 key benefits
- Dataset Categories with 5 categories (Academic Reasoning, STEM, Multilingual, OCR, Speech)
- Pipeline visualization (6 steps)
- Target audience section
- Benchmark impact table (MMLU +7.2%, AIME +11.5%, GAIA +6.3%, Arena Hard +5.1%)
- CTA sections

### Dataset Pages
- Dataset catalog with search
- 5 detailed dataset pages:
  - Academic Reasoning (JEE/Olympiad)
  - STEM Datasets (Physics, Chemistry, Math)
  - Multilingual Education (12+ languages)
  - OCR & Document AI
  - Speech & Audio Learning

### Lead Capture
- Lead form with fields: Name, Email, Company, Role, Company Type, Use Case, Dataset Interest
- Immediate download after submission
- Leads stored in MongoDB

### Admin Panel (/admin)
- Login: admin / schand2024
- Dashboard with stats (Files, Leads, Downloads)
- File management (upload CSV/PDF/JSON/XLSX)
- Lead management (view/delete)

### Other Pages
- Solutions (Pretraining, SFT, RLHF, Benchmarks)
- Industries (AI Labs, EdTech, Research, Foundation Models)
- Resources (Sample Datasets, Reports, Papers, Blog)
- Contact page with full form

## Prioritized Backlog

### P0 (Critical)
- ✅ All core pages implemented
- ✅ Admin file upload working
- ✅ Lead capture functional

### P1 (Important)
- Email notifications for new leads
- Dataset versioning
- Download analytics

### P2 (Nice to have)
- Blog content management
- API documentation page
- Comparison tool for datasets
- Custom dataset request wizard

## Next Tasks
1. Add email notifications when new leads are captured
2. Create sample CSV files for each dataset category
3. Add testimonials/case studies section
4. Implement dataset preview with actual sample data
5. Add download tracking and analytics dashboard
