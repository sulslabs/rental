'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { getCurrentUser, logout as dataLogout } from '@/lib/data'

interface AuthContextType {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = () => {
            const currentUser = getCurrentUser()
            setUser(currentUser)
            setLoading(false)
        }
        checkUser()
    }, [])

    const logout = () => {
        setUser(null)
        dataLogout()
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
