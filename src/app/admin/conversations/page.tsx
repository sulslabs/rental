'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Home,
    MessageSquare,
    User as UserIcon,
    ChevronLeft,
    Menu,
    LogOut,
    Image,
    Settings,
    UserCircle,
    Eye,
    EyeOff,
    Trash2,
    BarChart3,
    CheckCircle2,
    Circle
} from 'lucide-react'
import type { Lead } from '@/types'

export default function ConversationsPage() {
    const { user, loading: authLoading, logout } = useAuth()
    const router = useRouter()

    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

    // Protect route
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin/login')
        }
    }, [user, authLoading, router])

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads')
            if (res.ok) {
                const data = await res.json()
                setLeads(data.leads || [])
            }
        } catch (err) {
            console.error('Error fetching leads:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchLeads()
        }
    }, [user])

    async function handleMarkAsRead(id: string) {
        const lead = leads.find(l => l.id === id)
        const newStatus = lead?.status === 'unread' ? 'read' : 'unread'

        await fetch(`/api/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })

        fetchLeads()
    }



    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este mensaje?')) return

        await fetch(`/api/leads/${id}`, { method: 'DELETE' })
        fetchLeads()
    }

    async function handleToggleClosed(id: string) {
        const lead = leads.find(l => l.id === id)
        const newClosed = !lead?.closed

        await fetch(`/api/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ closed: newClosed })
        })

        fetchLeads()
    }

    const filteredLeads = leads.filter(lead => {
        if (filter === 'all') return true
        return lead.status === filter
    })

    const unreadCount = leads.filter(l => l.status === 'unread').length

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} bg-gray-900 text-white flex-shrink-0 transition-all duration-300 overflow-hidden`}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold truncate">{user.name}</h2>
                                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                            </div>
                        )}
                    </div>

                    <nav className="space-y-2 flex-1">
                        <button
                            onClick={() => router.push('/admin')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <Image className="w-5 h-5" />
                            {sidebarOpen && <span>Propiedades</span>}
                        </button>

                        <button
                            onClick={() => router.push('/admin/conversations')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-500 text-white transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            {sidebarOpen && (
                                <div className="flex items-center gap-2 flex-1">
                                    <span>Comunicaciones</span>
                                    {unreadCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => router.push('/admin/reports')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <BarChart3 className="w-5 h-5" />
                            {sidebarOpen && <span>Reportes</span>}
                        </button>

                        <button
                            onClick={() => router.push('/admin?tab=profile')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <UserCircle className="w-5 h-5" />
                            {sidebarOpen && <span>Datos personales</span>}
                        </button>

                        {user.role === 'admin' && (
                            <button
                                onClick={() => router.push('/admin/users')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                                <UserIcon className="w-5 h-5" />
                                {sidebarOpen && <span>Usuarios</span>}
                            </button>
                        )}

                        {user.role === 'admin' && (
                            <button
                                onClick={() => router.push('/admin?tab=settings')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                {sidebarOpen && <span>Configuración</span>}
                            </button>
                        )}

                        <a
                            href="/"
                            target="_blank"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <Eye className="w-5 h-5" />
                            {sidebarOpen && <span>Ver Sitio</span>}
                        </a>
                    </nav>

                    <div className="space-y-2">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            {sidebarOpen && <span>Cerrar Sesión</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-white overflow-auto">
                <header className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900">Comunicaciones de Interesados</h1>
                        <p className="text-sm text-gray-600">
                            {user.role === 'admin' ? 'Todos los leads del sistema' : 'Leads de tus propiedades'}
                        </p>
                    </div>
                </header>

                <div className="p-6">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Todos ({leads.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread' ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            No leídos ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'read' ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Leídos ({leads.length - unreadCount})
                        </button>
                    </div>

                    {/* Leads List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                No hay mensajes {filter !== 'all' ? (filter === 'unread' ? 'no leídos' : 'leídos') : 'aún'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    className={`bg-white rounded-lg shadow-sm p-5 border-l-4 transition-all ${lead.status === 'unread'
                                        ? 'border-blue-500 bg-blue-50/30'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{lead.name || 'Sin nombre'}</h3>
                                                {lead.status === 'unread' && (
                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                        Nuevo
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <p>📧 {lead.email}</p>
                                                    {lead.closed && (
                                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">
                                                            <CheckCircle2 className="w-3 h-3" /> Concretado
                                                        </span>
                                                    )}
                                                </div>
                                                <p>📱 {lead.phone}</p>

                                                {lead.propertyName && (
                                                    <p className="text-primary-600 font-medium">
                                                        🏠 {lead.propertyName}
                                                        {lead.propertyReference && (
                                                            <span className="text-gray-500 text-xs ml-2 font-normal">
                                                                (Ref: {lead.propertyReference})
                                                            </span>
                                                        )}
                                                    </p>
                                                )}

                                                {lead.closed && (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">
                                                        <CheckCircle2 className="w-3 h-3" /> Concretado
                                                    </span>
                                                )}

                                                {lead.checkin && (
                                                    <p>
                                                        📅 {new Date(lead.checkin).toLocaleDateString('es-UY')} - {new Date(lead.checkout!).toLocaleDateString('es-UY')}
                                                        {lead.guests && ` • ${lead.guests} huéspedes`}
                                                    </p>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400 mt-3">
                                                {new Date(lead.createdAt).toLocaleString('es-UY')}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 ml-4">


                                            <button
                                                onClick={() => handleMarkAsRead(lead.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title={lead.status === 'unread' ? 'Marcar como leído' : 'Marcar como no leído'}
                                            >
                                                {lead.status === 'unread' ? (
                                                    <Eye className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="border-l pl-2 ml-2 flex items-center">
                                                <button
                                                    onClick={() => handleToggleClosed(lead.id)}
                                                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${lead.closed
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                        }`}
                                                    title={lead.closed ? 'Marcar como no concretado' : 'Marcar como concretado'}
                                                >
                                                    {lead.closed ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : (
                                                        <Circle className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main >
        </div >
    )
}
