# InsightAI Enterprise Frontend

A modern, production-ready React application for data analytics and visualization with multi-tenant support, built with TypeScript, Tailwind CSS, and AWS integration.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture** - Support for multiple organizations
- **AWS Cognito Authentication** - Secure user authentication and authorization
- **Role-Based Access Control (RBAC)** - Owner, Admin, Analyst, and Viewer roles
- **CSV/JSON Upload** - Advanced file upload with drag-and-drop and preview
- **Interactive Dashboards** - Create and manage data visualizations
- **Real-time Analysis** - Monitor data processing jobs with live updates
- **Audit Logging** - Track user activities and system events

### Technical Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: react-hook-form with Zod validation
- **Charts**: Recharts for data visualization
- **Internationalization**: i18next (Portuguese/English)
- **Testing**: Vitest + React Testing Library

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd insightai-frontend
npm install
```

2. **Environment Configuration:**
Create a `.env` file in the root directory:

```env
# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id  
VITE_COGNITO_REGION=us-east-1

# API Configuration
VITE_API_BASE_URL=https://your-api-gateway-url.com

# Upload Configuration  
VITE_UPLOAD_MAX_MB=50
```

3. **Start Development Server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development Features

### Mock Mode
When `VITE_API_BASE_URL` is not defined, the application automatically switches to **mock mode** using MSW (Mock Service Worker). This allows full UI testing without a backend:

- Realistic API responses with simulated latency
- Complete dataset for dashboards, users, and analytics
- File upload simulation with progress tracking
- All CRUD operations work seamlessly

### Demo Credentials
For testing, use these demo credentials:
- **Email**: `demo@insightai.com`
- **Password**: `demo123`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

## 🏗️ Architecture

### File Structure
```
src/
├── api/                 # API client, hooks, and mocks
├── components/          
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # App shell, sidebar, header
│   ├── auth/           # Authentication guards
│   └── common/         # Shared components
├── i18n/               # Internationalization
├── lib/                # Utilities and helpers
├── providers/          # React context providers
├── routes/             # Page components
├── store/              # Zustand stores
├── types/              # TypeScript definitions
└── test/               # Test files
```

### Key Components

**AppShell**: Main layout with sidebar navigation and header
**AuthGuard**: Route protection with role-based access
**UploadDialog**: Advanced file upload with preview
**DataTable**: Virtualized tables for large datasets
**ChartPanel**: Wrapper for Recharts visualizations

## 🎨 Design System

### Theme Support
- **Light/Dark Mode**: System-aware theme switching
- **Consistent Colors**: Semantic color tokens for all states
- **Typography Scale**: Hierarchical text sizing
- **Spacing System**: 8px grid-based spacing

### Responsive Design
- **Desktop-first**: Optimized for desktop workflows
- **Mobile Compatible**: Functional on mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔐 Security

### Authentication Flow
1. **AWS Cognito Integration** - Secure token-based authentication
2. **Auto-refresh** - Silent token renewal
3. **Protected Routes** - Authentication guards on all app routes
4. **Role Validation** - Server-side role verification

### Data Protection
- No sensitive data in localStorage (tokens managed by Amplify)
- HTTPS enforcement in production
- Input validation and sanitization
- File upload restrictions and validation

## 🌍 Internationalization

The app supports multiple languages:
- **Portuguese (pt-BR)** - Default language
- **English (en)** - Fallback language

Language switching is persisted per user and integrates with the user's browser preferences.

## 📊 Features Overview

### Dashboard Management
- Create, edit, and delete dashboards
- Drag-and-drop tile arrangement
- Multiple chart types (line, bar, pie, KPI)
- Real-time data filtering
- Export capabilities (CSV, PNG)

### Dataset Management
- Upload CSV/JSON files with validation
- Preview data before processing
- Column detection and type inference
- File size and format restrictions
- Upload progress tracking with cancellation

### Analysis & History
- Monitor processing jobs in real-time
- View detailed logs and progress
- Retry failed analyses
- Historical job tracking
- Status notifications

### Admin Features
- User management with role assignment
- Organization settings
- Audit log viewing
- System monitoring
- Usage analytics

## 🧪 Testing

The application includes comprehensive tests:

```bash
npm run test                    # Run all tests
npm run test:ui                 # Interactive test UI
npm run test -- --coverage     # Coverage report
```

**Test Coverage:**
- Authentication flows
- Route protection
- Component rendering
- API integration
- Form validation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
Ensure all required environment variables are set:

```env
VITE_COGNITO_USER_POOL_ID=prod-user-pool-id
VITE_COGNITO_CLIENT_ID=prod-client-id
VITE_COGNITO_REGION=us-east-1
VITE_API_BASE_URL=https://prod-api.yourcompany.com
VITE_UPLOAD_MAX_MB=100
```

### Performance Optimizations
- **Code Splitting** - Lazy loaded routes
- **Bundle Analysis** - Optimized dependency loading
- **Image Optimization** - WebP support with fallbacks
- **Caching Strategy** - Appropriate cache headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Open an issue for bugs
- Contact the development team for features

---

**InsightAI** - Transforming data into actionable insights with enterprise-grade security and scalability.