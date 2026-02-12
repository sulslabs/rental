import type { Property, SiteSettings } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rond-point-rentals-ai-kx5aus62lq-uc.a.run.app'

// Token management
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Helper to fetch from API
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`}`
    const token = getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        ...headers,
        ...options?.headers,
      },
    })

    if (response.ok) {
      return await response.json()
    }

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/admin/login'
      return null
    }

    // Extract error message from body if possible
    let errorMessage = `API error ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData.error) errorMessage = errorData.error
    } catch (e) {
      // Not a JSON error body
    }

    console.error(`API error on ${endpoint}:`, errorMessage)
    throw new Error(errorMessage)
  } catch (error: any) {
    console.error(`Fetch error on ${endpoint}:`, error)
    throw error // Re-throw so callers identify connection issues vs null data
  }
}

// SETTINGS
export async function getSettings(): Promise<SiteSettings> {
  const data = await apiFetch<SiteSettings>('settings')
  if (data) {
    console.log('Loaded settings from API')
    return data
  }

  console.error('API Error: Could not load settings')
  throw new Error('Critical: Could not load site settings from API')
}

export async function saveSettings(settings: SiteSettings): Promise<boolean> {
  const result = await apiFetch<{ success: boolean }>('settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
  return !!result?.success
}

// PROPERTIES
export async function getProperties(): Promise<Property[]> {
  const data = await apiFetch<{ properties: Property[] }>('properties')

  if (data?.properties) {
    console.log('Loaded properties from API')
    return data.properties
  }

  if (Array.isArray(data)) {
    return data
  }

  console.warn('API Warning: No properties returned from API')
  return []
}

// Get single property
export async function getProperty(id: string): Promise<Property | undefined> {
  const data = await apiFetch<Property>(`properties/${id}`)
  if (data && !('error' in data)) {
    return data
  }

  return undefined
}

// Create property
export async function createProperty(propertyIdLess: Omit<Property, 'id'>): Promise<Property> {
  const data = await apiFetch<Property>('properties', {
    method: 'POST',
    body: JSON.stringify(propertyIdLess),
  })

  if (data && !('error' in data)) {
    return data
  }

  throw new Error('Could not create property in backend')
}

// Update property
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const response = await apiFetch<{ success: boolean }>(`properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })

  if (response?.success) {
    const updated = await getProperty(id)
    return updated || null
  }

  return null
}

export async function saveProperty(property: Partial<Property> & { title: string }): Promise<Property | null> {
  const isNew = !property.id || property.id.startsWith('new-')
  if (isNew) {
    const { id, ...data } = property
    return createProperty(data as Omit<Property, 'id'>)
  } else {
    return updateProperty(property.id as string, property)
  }
}

// Delete property
export async function deleteProperty(id: string): Promise<boolean> {
  const response = await apiFetch<{ success: boolean }>(`properties/${id}`, {
    method: 'DELETE',
  })
  return !!response?.success
}

// AIRBNB IMPORT
export async function importAirbnb(url: string): Promise<Partial<Property> | null> {
  const data = await apiFetch<Partial<Property>>('properties/import-airbnb', {
    method: 'POST',
    body: JSON.stringify({ url: url.trim() }),
  })

  if (data && !('error' in data)) {
    return data
  }

  return null
}

// Helper to save entire properties list (kept for compatibility, though API handles individual)
export async function saveProperties(properties: Property[]): Promise<boolean> {
  console.warn('saveProperties is deprecated - use create/update/delete instead')
  // This is a rough batch implementation if needed, but the backend prefers individual actions
  for (const property of properties) {
    await updateProperty(property.id, property)
  }
  return true
}
// AUTH
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'owner'
  active?: boolean
}

export async function login(email: string, password: string): Promise<{ user: User, token: string } | null> {
  const data = await apiFetch<{ user: User, token: string }>('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })

  if (data?.token) {
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    return data
  }

  return null
}

export function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  window.location.href = '/admin/login'
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('auth_user')
  return user ? JSON.parse(user) : null
}

export async function getUsers(): Promise<User[]> {
  const data = await apiFetch<User[]>('users')
  return data || []
}

export async function adminCreateUser(userData: any): Promise<User | null> {
  console.log('DEBUG: Calling adminCreateUser with userData:', userData)
  return await apiFetch<User>('users', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export async function updateUserStatus(userId: string, active: boolean): Promise<boolean> {
  const data = await apiFetch<{ success: boolean }>(`users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ active })
  })
  return !!data?.success
}

export async function updateMe(userData: Partial<User>): Promise<boolean> {
  const data = await apiFetch<{ success: boolean }>('users/me', {
    method: 'PUT',
    body: JSON.stringify(userData)
  })

  if (data?.success) {
    // Update local storage user data
    const current = getCurrentUser()
    if (current) {
      const updated = { ...current, ...userData }
      localStorage.setItem('auth_user', JSON.stringify(updated))
    }
    return true
  }
  return false
}
