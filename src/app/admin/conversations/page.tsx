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
    Clock,
    ExternalLink,
    MessageCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ConversationsPage() {
    const { user, loading: authLoading, logout } = useAuth()
    const router = useRouter()

    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [selectedConv, setSelectedConv] = useState<any | null>(null)
    const [fetchingMessages, setFetchingMessages] = useState(false)

    // Protect route
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin/login')
        }
    }, [user, authLoading, router])

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations')
            if (res.ok) {
                const data = await res.json()
                setConversations(data.conversations || [])
            }
        } catch (err) {
            console.error('Error fetching conversations:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchConversations()
        }
    }, [user])

    const handleSelectConv = async (conv: any) => {
        setSelectedConv(conv)
        setFetchingMessages(true)
        try {
            const res = await fetch(`/api/conversations/${conv.id}`)
            if (res.ok) {
                const data = await res.json()
                setSelectedConv(data)
            }
        } catch (err) {
            console.error('Error fetching conversion details:', err)
        } finally {
            setFetchingMessages(false)
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
                            {sidebarOpen && <span>Mensajes</span>}
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

                        <button
                            onClick={() => router.push('/admin?tab=settings')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            {sidebarOpen && <span>Configuración</span>}
                        </button>
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
            <main className="flex-1 flex flex-col min-w-0 bg-white">
                <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Conversaciones</h1>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Conversation List */}
                    <div className="w-1/3 border-r overflow-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Cargando chats...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No hay conversaciones activas.</div>
                        ) : (
                            <div className="divide-y">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => handleSelectConv(conv)}
                                        className={`w-full p-4 flex flex-col gap-1 text-left hover:bg-gray-50 transition-colors ${selectedConv?.id === conv.id ? 'bg-primary-50 border-r-4 border-r-primary-500' : ''}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900 truncate flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-primary-500" /> Lead {conv.leadId.substring(0, 5)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(conv.updatedAt || conv.updated_at), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            Canal: {conv.channel || 'whatsapp'}
                                        </div>
                                        {conv.context?.discussedProperties?.length > 0 && (
                                            <div className="text-xs text-primary-600 font-medium">
                                                Propiedad: {conv.context.discussedProperties[0]}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                        {selectedConv ? (
                            <>
                                <div className="p-4 bg-white border-b flex justify-between items-center">
                                    <div>
                                        <h2 className="font-bold text-gray-900">Detalles del Lead</h2>
                                        <p className="text-sm text-gray-500">ID: {selectedConv.leadId}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedConv.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedConv.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto p-6 space-y-4">
                                    {fetchingMessages ? (
                                        <div className="flex justify-center py-8">
                                            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : selectedConv.messages?.map((msg: any) => (
                                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                                ? 'bg-white text-gray-800'
                                                : 'bg-primary-500 text-white'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-gray-400' : 'text-primary-100'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
                                <MessageSquare className="w-16 h-16 opacity-20" />
                                <p>Selecciona una conversación para ver los detalles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
