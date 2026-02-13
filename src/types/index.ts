export interface Property {
  id: string;
  referenceCode?: string; // Número de ficha manual (ej: "PDE-001")
  airbnbId?: string; // ID específico de Airbnb
  title: string;
  description: string;
  location: string;
  price: string;
  priceNote?: string;
  images: string[];
  airbnbUrl: string;
  featured: boolean;
  active: boolean;
  amenities: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  rating?: string;
}

export interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  footerText: string;
  adminPassword: string;
  // Analytics & Tracking
  googleAnalyticsId?: string;    // GA4: G-XXXXXXXXXX
  metaPixelId?: string;          // Facebook Pixel: 123456789
  googleTagManagerId?: string;   // GTM: GTM-XXXXXXX
  customHeadCode?: string;       // Código personalizado para <head>
}

export interface NotificationPreferences {
  whatsapp: {
    enabled: boolean;
    schedule: 'always' | 'business_hours';
  };
  email: {
    enabled: boolean;
    schedule: 'always';
  };
  timezone: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role?: 'admin' | 'owner' | 'user';
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  notificationPreferences?: NotificationPreferences;
}
