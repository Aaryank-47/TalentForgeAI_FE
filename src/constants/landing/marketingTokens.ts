// Centralized design tokens for all public marketing pages

export const marketingTokens = {
  colors: {
    // Primary Brand
    primary: 'bg-[#2563EB]',
    primaryHover: 'hover:bg-[#1D4ED8]',
    primaryText: 'text-[#2563EB]',
    primaryBorder: 'border-[#2563EB]',
    
    // Backgrounds
    surface: 'bg-white',
    backgroundLight: 'bg-[#F8FAFC]',
    backgroundBlue: 'bg-[#F0F6FF]',
    
    // Borders & Shadows
    border: 'border-slate-100/80',
    shadowCard: 'shadow-sm hover:shadow-xl hover:shadow-blue-100/60',
    shadowButton: 'shadow-lg shadow-blue-200/60 hover:-translate-y-0.5',
    
    // Text
    heading: 'text-[#0F172A]',
    body: 'text-slate-500',
    muted: 'text-slate-400',
    
    // Badges
    badgeBg: 'bg-blue-100/80',
    badgeText: 'text-[#2563EB]',
    
    // Icon Containers
    iconContainerBg: 'bg-blue-50/80',
    iconContainerBorder: 'border border-blue-100/60',
  },
  
  // Normalized Sizes
  radius: {
    card: 'rounded-[24px]',
    button: 'rounded-[12px]',
    badge: 'rounded-full',
    iconContainer: 'rounded-[12px]',
  },
  
  // Icon Component Sizes
  iconSizes: {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  }
};
