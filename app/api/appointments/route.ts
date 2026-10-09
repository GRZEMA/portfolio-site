import { NextResponse } from 'next/server'
import { createAppointmentId, appointmentSecret, signAppointment } from '@/lib/appointments/token'
import { parseAppointmentInput, toAppointment } from '@/lib/appointments/schema'
import { sendGuestReceived, sendOwnerRequest } from '@/lib/appointments/mailer'
import { siteUrlFrom } from '@/lib/appointments/site'

export const runtime = 'nodejs'

const hits = new Map<string, number[]>()

function clientIp(req: Request): string {
	const forwarded = req.headers.get('x-forwarded-for')
	if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
	return req.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
	const now = Date.now()
	const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < 60 * 60 * 1000)
	if (recent.length >= 5) {
		hits.set(ip, recent)
		return true
	}
	recent.push(now)
	hits.set(ip, recent)
	return false
}

export const POST = async (req: Request) => {
	try {
		const body: unknown = await req.json()
		const raw = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}

		if (isRateLimited(clientIp(req))) {
			return NextResponse.json(
				{ error: 'Too many requests. Try again in a little while.', code: 'rate' },
				{ status: 429 }
			)
		}

		if (typeof raw.website === 'string' && raw.website.trim()) {
			return NextResponse.json({ data: 'Request received.' })
		}

		const parsed = parseAppointmentInput(body)
		if (!parsed.ok) {
			return NextResponse.json(
				{ error: 'Please check the form and try again.', code: parsed.code },
				{ status: 400 }
			)
		}

		if (!process.env.RESEND_API_KEY || !appointmentSecret()) {
			return NextResponse.json(
				{ error: 'Email service is not configured', code: 'email-config' },
				{ status: 500 }
			)
		}

		const appointment = toAppointment(parsed.value, createAppointmentId())
		const token = signAppointment(appointment)
		await sendOwnerRequest(appointment, token, siteUrlFrom(req))

		try {
			await sendGuestReceived(appointment)
		} catch (error) {
			console.error('Guest receipt email failed', error)
		}

		return NextResponse.json({ data: 'Request received.' })
	} catch (error) {
		console.error('Appointment request failed', error)
		return NextResponse.json(
			{ error: 'Unexpected error while sending the request', code: 'unexpected' },
			{ status: 500 }
		)
	}
}
