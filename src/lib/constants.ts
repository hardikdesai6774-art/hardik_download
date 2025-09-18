/**
 * Application-wide constants and configuration
 * Centralized design tokens and configuration values
 */

// Design tokens
export const DESIGN_TOKENS = {
  // Layout
  maxWidth: 'max-w-[412px]',
  headerHeight: 'h-14',
  padding: 'px-4',
  
  // Spacing
  spacing: {
    xs: 'px-2 py-1',
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-6'
  },
  
  // Colors
  colors: {
    primary: 'bg-blue-500',
    secondary: 'bg-emerald-600',
    accent: 'bg-rose-600',
    background: 'bg-white',
    text: 'text-black',
    textMuted: 'text-gray-400'
  },
  
  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
} as const;

// App configuration
export const APP_CONFIG = {
  name: 'Live Sexy Chat',
  version: '1.0.0',
  rating: 4.4,
  reviews: '143K',
  downloads: '10M+',
  ageRating: '12+',
  price: '2.00₹ Me Video Calls'
} as const;

// Download configuration
export const DOWNLOAD_CONFIG = {
  countdownSeconds: 4,
  apkFile: '/live sexy chat.apk',
  zipFile: '/Live Sexy Chat.zip',
  fallbackDelay: 1000
} as const;

// Animation delays for staggered effects
export const ANIMATION_DELAYS = {
  xs: 100,
  sm: 150,
  md: 200,
  lg: 300,
  xl: 400
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 'max-w-[412px]',
  tablet: 'md:max-w-2xl',
  desktop: 'lg:max-w-4xl'
} as const;
