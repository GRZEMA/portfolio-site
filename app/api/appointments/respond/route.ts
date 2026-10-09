import { NextResponse } from 'next/server'
import { getDecision, saveDecision } from '@/lib/appointments/decisions'
import {
	isCalendarConfigured,
	recordAccepted,
	recordRejected,
} from '@/lib/appointments/google-calendar'
import { sendGuestDecision } from '@/lib/appointments/mailer'
import { siteUrlFrom } from '@/lib/appointments/site'
import { verifyAppointment } from '@/lib/appointments/token'

export const runtime = 'nodejs'

function redirectTo(req: Request, result: string) {
	const url = new URL('/appointments/respond/done', req.url)
	url.searchParams.set('result', result)
	return NextResponse.redirect(url, 303)
}

function cleanNote(value: FormDataEntryValue | null): string {
	if (typeof value !== 'string') return ''
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, 500)
}

export const POST = async (req: Request) => {
	try {
		const form = await req.formData()
		const token = String(form.get('token') ?? '')
		const action = String(form.get('action') ?? '')
		const note = cleanNote(form.get('note'))

		if (action !== 'accept' && action !== 'reject') return redirectTo(req, 'invalid')

		const verified = verifyAppointment(token)
		if (!verified.ok) return redirectTo(req, verified.reason)

		const { appointment } = verified
		const existing = await getDecision(appointment.id)
		if (existing === 'accepted') return redirectTo(req, 'already-accepted')
		if (existing === 'rejected') return redirectTo(req, 'already-rejected')

		if (action === 'accept') {
			if (!isCalendarConfigured()) return redirectTo(req, 'calendar-missing')
			const recorded = await recordAccepted(appointment, note || undefined)
			if (!recorded.created) {
				return redirectTo(
					req,
					recorded.decision === 'rejected' ? 'already-rejected' : 'already-accepted'
				)
			}
			await saveDecision(appointment.id, 'accepted')
			try {
				await sendGuestDecision(appointment, 'accepted', siteUrlFrom(req), note || undefined)
			} catch (error) {
				console.error('Accepted email failed', error)
				return redirectTo(req, 'accepted-email-failed')
			}
			return redirectTo(req, 'accepted')
		}

		if (isCalendarConfigured()) {
			const recorded = await recordRejected(appointment, note || undefined)
			if (!recorded.created) {
				return redirectTo(
					req,
					recorded.decision === 'accepted' ? 'already-accepted' : 'already-rejected'
				)
			}
		}

		await saveDecision(appointment.id, 'rejected')
		try {
			await sendGuestDecision(appointment, 'rejected', siteUrlFrom(req), note || undefined)
		} catch (error) {
			console.error('Rejected email failed', error)
			return redirectTo(req, 'rejected-email-failed')
		}
		return redirectTo(req, 'rejected')
	} catch (error) {
		console.error('Appointment response failed', error)
		return redirectTo(req, 'error')
	}
}
