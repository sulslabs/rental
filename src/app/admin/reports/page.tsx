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
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    Eye
} from 'lucide-react'

interface ReportStats {
    totalLeads: number
    unreadLeads: number
    readLeads: number
    leadsLast7Days: number
    leadsLast30Days: number
    topProperties: Array<{ name: string; count: number }>
}

export default function ReportsPage() {
    const { user, loading: authLoading, logout } = useAuth()
    const router = useRouter()

    const [stats, setStats] = useState<ReportStats>({
        totalLeads: 0,
        unreadLeads: 0,
        readLeads: 0,
        leadsLast7Days: 0,
        leadsLast30Days: 0,
        topProperties: []
    })
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Protect route
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin/login')
        }
    }, [user, authLoading, router])

    // Fetch report data
    useEffect(() => {
        if (user) {
            fetchReportData()
        }
    }, [user])

    const fetchReportData = async () => {
        try {
            const res = await fetch('/api/reports')
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (err) {
            console.error('Error fetching report data:', err)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
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
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            {sidebarOpen && <span>Comunicaciones</span>}
                        </button>

                        <button
                            onClick={() => router.push('/admin/reports')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-500 text-white transition-colors"
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
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Reportes y Métricas</h1>
                            <p className="text-sm text-gray-600">
                                {user.role === 'admin' ? 'Vista general del sistema' : 'Rendimiento de tus propiedades'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-600">Total Comunicaciones</h3>
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                                    <p className="text-xs text-gray-500 mt-1">Desde el inicio</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-600">Últimos 7 días</h3>
                                        <Calendar className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.leadsLast7Days}</p>
                                    <p className="text-xs text-gray-500 mt-1">Comunicaciones recientes</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-600">Últimos 30 días</h3>
                                        <TrendingUp className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.leadsLast30Days}</p>
                                    <p className="text-xs text-gray-500 mt-1">Último mes</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
                                        <MessageSquare className="w-5 h-5 text-red-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.unreadLeads}</p>
                                    <p className="text-xs text-gray-500 mt-1">Sin leer</p>
                                </div>
                            </div>

                            {/* Top Properties */}
                            {stats.topProperties.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Propiedades Más Consultadas</h2>
                                    <div className="space-y-3">
                                        {stats.topProperties.map((property, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{property.name}</span>
                                                </div>
                                                <span className="text-lg font-bold text-primary-500">{property.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coming Soon Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-8 text-center border-2 border-dashed border-blue-200">
                                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Próximamente: Más Métricas</h3>
                                <p className="text-gray-600 mb-4">
                                    Estamos trabajando en agregar más funcionalidades:
                                </p>
                                <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
                                    <li>📊 Gráficos de tendencias temporales</li>
                                    <li>💰 Tracking de conversiones y reservas</li>
                                    <li>⏱️ Tiempo promedio de respuesta</li>
                                    <li>📈 ROI por propiedad</li>
                                    <li>🎯 Análisis de fuentes de leads</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
