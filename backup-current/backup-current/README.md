# Live Sexy Chat - Landing Page

A modern, responsive landing page for the Live Sexy Chat mobile application, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Optimized for all device sizes
- **TypeScript**: Full type safety and better development experience
- **Component Library**: Built with shadcn/ui components
- **Performance**: Optimized with Vite and modern React patterns
- **Download System**: Intelligent APK download with fallback logic
- **SEO Ready**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + React Hooks
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **Deployment**: Netlify

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Application header
│   ├── AppStoreSection.tsx # App store information
│   └── ...             # Other components
├── lib/                 # Utility functions and constants
│   ├── constants.ts    # Design tokens and configuration
│   ├── downloadApk.ts  # Download logic
│   └── utils.ts        # Helper functions
├── hooks/               # Custom React hooks
├── pages/               # Page components
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frnd-pixel-perfect-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

The project uses a centralized design system with:

- **Design Tokens**: Consistent spacing, colors, and shadows
- **Component Library**: Reusable UI components
- **Responsive Breakpoints**: Mobile-first approach
- **Animation Delays**: Staggered animations for better UX

### Key Constants

```typescript
// Design tokens
export const DESIGN_TOKENS = {
  maxWidth: 'max-w-[412px]',
  headerHeight: 'h-14',
  colors: { primary: 'bg-blue-500', ... },
  shadows: { sm: 'shadow-sm', ... }
}

// App configuration
export const APP_CONFIG = {
  name: 'Live Sexy Chat',
  rating: 4.4,
  downloads: '10M+'
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Live Sexy Chat
VITE_APP_VERSION=1.0.0
```

### Build Configuration

The project uses Vite for building. Configuration can be found in `vite.config.ts`.

## 📦 Deployment

### Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy using Netlify CLI**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Ensure the `public` folder is accessible for APK downloads

## 🎯 Key Components

### Header Component
- Sticky navigation with app branding
- Responsive design with proper spacing
- Professional icon placement

### Download System
- Intelligent APK download with fallback
- Error handling and user feedback
- Toast notifications for better UX

### App Store Section
- App information and ratings
- Download statistics
- Professional presentation

## 🔍 Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Component Architecture**: Modular and reusable
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized rendering and loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies**
