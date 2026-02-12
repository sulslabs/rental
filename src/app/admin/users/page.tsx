'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Home,
    User as UserIcon,
    Plus,
    Trash2,
    Mail,
    Shield,
    CheckCircle,
    XCircle,
    ChevronLeft,
    Menu,
    LogOut,
    Image,
    Settings
} from 'lucide-react'
import {
    getUsers,
    adminCreateUser,
    updateUserStatus,
    User
} from '@/lib/data'

export default function UsersPage() {
    const { user, loading: authLoading, logout } = useAuth()
    const router = useRouter()

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'owner' as 'admin' | 'owner'
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Protect route (Admin only)
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/login')
            } else if (user.role !== 'admin') {
                router.push('/admin')
            }
        }
    }, [user, authLoading, router])

    const fetchUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (err) {
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers()
        }
    }, [user])

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const user = await adminCreateUser(newUser)
            if (user) {
                setShowModal(false)
                setNewUser({ name: '', email: '', password: '', role: 'owner' })
                fetchUsers()
            } else {
                setError('Error al crear usuario. Verifica los datos.')
            }
        } catch (err: any) {
            console.error('Full connection error details:', err)
            setError(err.message || (err.toString && err.toString()) || 'Error de conexión')
        } finally {
            setSaving(false)
        }
    }

    const handleToggleUserStatus = async (userId: string, active: boolean) => {
        try {
            const success = await updateUserStatus(userId, active)
            if (success) {
                setUsers(users.map(u => u.id === userId ? { ...u, active } as any : u))
            }
        } catch (err) {
            console.error('Error updating user status:', err)
        }
    }

    if (authLoading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar (consistent with AdminPage) */}
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
                            onClick={() => router.push('/admin/users')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-500 text-white transition-colors"
                        >
                            <UserIcon className="w-5 h-5" />
                            {sidebarOpen && <span>Usuarios</span>}
                        </button>

                        {user.role === 'admin' && (
                            <button
                                onClick={() => router.push('/admin?tab=settings')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                {sidebarOpen && <span>Configuración</span>}
                            </button>
                        )}
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
                        <h1 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Usuario
                    </button>
                </header>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u: any) => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> {u.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {u.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleToggleUserStatus(u.id, !u.active)}
                                                className={`text-sm font-medium ${u.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            >
                                                {u.active ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* New User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Usuario</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="admin-label">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="admin-input"
                                    placeholder="Ej: Paula Garcia"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="admin-input"
                                    placeholder="paula@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="admin-input"
                                    placeholder="Min. 8 caracteres"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Rol</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                    className="admin-input"
                                >
                                    <option value="owner">Property Owner</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            {error && <p className="text-red-500 text-sm italic">{error}</p>}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300"
                                >
                                    {saving ? 'Creando...' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
