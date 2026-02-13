import { NextResponse } from 'next/server'
import { getLeads, updateLead, deleteLead } from '@/lib/data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const data = await getLeads()

        return NextResponse.json(data || { leads: [] }, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
    } catch (error) {
        console.error('Error fetching leads:', error)
        return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 })
    }
}
