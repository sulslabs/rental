export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  amenities: string[]
  active: boolean
  featured: boolean
  airbnbId?: string
  ownerId?: string
}

export interface SiteSettings {
  siteName: string
  tagline: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  address: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
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
  createdAt: string
  updatedAt: string
}
