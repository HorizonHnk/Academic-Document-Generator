# PaperGen AI - Academic Document Generator

## Overview

PaperGen AI is a unified platform for generating professional academic documents using AI. The application supports four document types: technical reports (BET-standard), PowerPoint presentations, conference papers (IEEE format), and thesis/dissertations (Harvard citations). Built with a React frontend and Express backend, it leverages Google Gemini 2.5 Flash for content generation and Pixabay API for image sourcing. The platform features file upload processing (PDF, DOCX, images), real-time preview, and multi-format export capabilities (DOCX, PDF, PPTX).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and bundler.

**UI System**: Shadcn/ui component library with Radix UI primitives, styled with Tailwind CSS. The design follows a "Design System + Productivity Reference" approach inspired by Linear and Notion, emphasizing clean efficiency and professional academic presentation.

**Routing**: Wouter for lightweight client-side routing with the following structure:
- `/` - Home page with document type selection
- `/projects` - User's saved projects
- `/generate/report` - Technical report generator
- `/generate/powerpoint` - Presentation generator
- `/generate/conference` - Conference paper generator
- `/generate/thesis` - Thesis/dissertation generator
- `/about` - About page with feature overview
- `/contact` - Contact form page
- `/settings` - User preferences and API key configuration

**State Management**: TanStack Query (React Query) for server state management with optimistic updates and cache invalidation. Local component state managed with React hooks.

**Key Design Patterns**:
- Shared `GeneratorLayout` component for consistent UI across all document generators
- Custom hooks for reusable logic (`useDocumentGenerator`, `useFileUpload`, `useProjectManagement`)
- Form-based input with tabbed interface (text input vs file upload)
- Real-time progress tracking during generation

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Structure**: RESTful API endpoints organized by document type:
- `POST /api/generate/report` - Generate technical reports
- `POST /api/generate/powerpoint` - Generate presentations
- `POST /api/generate/conference` - Generate conference papers
- `POST /api/generate/thesis` - Generate thesis documents
- `POST /api/files/process` - Extract text from uploaded files
- `POST /api/images/search` - Search Pixabay for images
- `POST /api/images/random` - Get random topic-relevant image

**File Processing**: Multer for multipart/form-data handling with in-memory storage (10MB limit). Supports PDF extraction (using pdfjs-dist) and DOCX extraction (using mammoth).

**Document Export**: DOCX generation using the `docx` library with support for complex academic formatting (headings, citations, tables, images).

**Development vs Production**:
- Development: Vite dev server with HMR integrated into Express
- Production: Serves static built files from `dist/public`

### Data Storage

**Current Implementation**: In-memory storage using a Map-based implementation (`MemStorage` class). Documents are stored temporarily during runtime and lost on server restart.

**Schema Definition**: Zod schemas for type-safe validation of documents and user preferences. Documents include metadata (type, title, creation date), content (sections, slides, generated content), and settings (tone, citation style, formatting options).

**Prepared for Database Migration**: Drizzle ORM configuration present (`drizzle.config.ts`) with PostgreSQL dialect, suggesting future migration to persistent storage. Schema defined in `shared/schema.ts` ready for database integration.

### Authentication & Authorization

**Planned Implementation**: Firebase Authentication infrastructure present but not yet active:
- Google Sign-In provider configuration
- Email/password authentication scaffolding
- `AuthDialog` component built but returns mock responses
- User ID currently hardcoded as "demo-user"

**Future State**: When activated, will use Firebase Auth for user sessions and Firestore for document persistence with user-scoped queries.

## External Dependencies

### AI Services

**Google Gemini 2.5 Flash**: Primary content generation engine accessed via `@google/genai` SDK. Used for:
- Structured academic content generation with configurable temperature (0.7 default)
- JSON response format support for structured data
- System instructions for domain-specific formatting
- Token limit: 8192 max output tokens

**Configuration**: Requires `GEMINI_API_KEY` environment variable. Graceful degradation with error messaging when not configured.

### Image Services

**Pixabay API**: Photo search and retrieval for document illustrations. Features:
- Keyword extraction from topics (filters generic terms, focuses on technical keywords)
- Safe search enabled
- Returns high-quality images with multiple resolution URLs
- Fallback to empty array when API key not configured

**Configuration**: Requires `PIXABAY_API_KEY` environment variable.

### Firebase (Planned)

**Services Prepared**:
- Firebase Authentication for user management
- Cloud Firestore for document storage
- Configuration using environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

**Current Status**: SDK initialized but authentication flows return mock data. Project management uses local memory storage instead of Firestore.

### Database

**Drizzle ORM**: Configured for PostgreSQL with Neon Database serverless driver (`@neondatabase/serverless`). Migration files output to `./migrations` directory. Requires `DATABASE_URL` environment variable. Not currently active in the codebase but infrastructure is ready for migration from in-memory storage.

### Build & Development Tools

- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Type safety across frontend and backend with shared types in `/shared`
- **ESBuild**: Backend bundling for production builds
- **PostCSS & Autoprefixer**: CSS processing pipeline
- **Tailwind CSS**: Utility-first styling with custom design tokens

### UI Component Libraries

- **Radix UI**: Accessible, unstyled component primitives (dialogs, dropdowns, tabs, etc.)
- **Lucide React**: Icon library
- **React Hook Form**: Form state management with Zod validation
- **Embla Carousel**: Carousel/slider functionality
- **Recharts**: Chart rendering (prepared for data visualization features)