import { NextResponse } from 'next/server'
import { updateLead, deleteLead } from '@/lib/data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const success = await updateLead(params.id, body)

        if (success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
        }
    } catch (error) {
        console.error('Error updating lead:', error)
        return NextResponse.json({ error: 'Error updating lead' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const success = await deleteLead(params.id)

        if (success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
        }
    } catch (error) {
        console.error('Error deleting lead:', error)
        return NextResponse.json({ error: 'Error deleting lead' }, { status: 500 })
    }
}
