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
  area?: number; // Keep for backward compatibility
  ownerId?: string; // Keep for backward compatibility
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

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'owner'
  notificationPreferences?: {
    whatsapp: {
      enabled: boolean
      schedule: 'always' | 'business_hours'
    }
    email: {
      enabled: boolean
      schedule: 'always' | 'business_hours'
    }
    timezone: string
  }
}

/**
 * Simplified lead for direct contact registrations
 * Displayed in /admin/conversations
 */
export interface Lead {
  id: string
  phone: string
  name?: string
  email?: string
  propertyId?: string
  propertyName?: string  // Enriched from backend
  checkin?: string
  checkout?: string
  guests?: number
  status: 'unread' | 'read' | 'archived'
  closed?: boolean
  createdAt: string
  updatedAt: string
}
