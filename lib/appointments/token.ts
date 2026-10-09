import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { Appointment } from '@/lib/appointments/schema'
import { isDuration } from '@/lib/appointments/constants'

export function appointmentSecret(): string | null {
	const secret = process.env.APPOINTMENT_SECRET || process.env.RESEND_API_KEY
	if (!secret || secret.length < 16) return null
	return secret
}

export function createAppointmentId(): string {
	return randomBytes(16).toString('hex')
}

function signBody(body: string, secret: string): string {
	return createHmac('sha256', secret).update(body).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
	const left = Buffer.from(a)
	const right = Buffer.from(b)
	if (left.length !== right.length) return false
	return timingSafeEqual(left, right)
}

export function signAppointment(appointment: Appointment): string {
	const secret = appointmentSecret()
	if (!secret) throw new Error('Appointment signing is not configured')
	const body = Buffer.from(JSON.stringify(appointment)).toString('base64url')
	return `${body}.${signBody(body, secret)}`
}

function isAppointment(value: unknown): value is Appointment {
	if (!value || typeof value !== 'object') return false
	const item = value as Partial<Appointment>
	return (
		typeof item.id === 'string' &&
		/^[0-9a-f]{32}$/.test(item.id) &&
		typeof item.name === 'string' &&
		typeof item.email === 'string' &&
		typeof item.date === 'string' &&
		typeof item.time === 'string' &&
		typeof item.topic === 'string' &&
		typeof item.message === 'string' &&
		(item.locale === 'en' || item.locale === 'pl') &&
		typeof item.durationMinutes === 'number' &&
		isDuration(item.durationMinutes) &&
		typeof item.start === 'string' &&
		typeof item.end === 'string' &&
		typeof item.timeZone === 'string' &&
		typeof item.createdAt === 'string' &&
		typeof item.exp === 'number'
	)
}

export function verifyAppointment(
	token: string,
	now = Date.now()
):
	| { ok: true; appointment: Appointment }
	| { ok: false; reason: 'invalid' | 'expired' } {
	const secret = appointmentSecret()
	if (!secret || !token || token.length > 12000) return { ok: false, reason: 'invalid' }

	const dot = token.indexOf('.')
	if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: 'invalid' }
	const body = token.slice(0, dot)
	const signature = token.slice(dot + 1)
	if (!safeEqual(signature, signBody(body, secret))) {
		return { ok: false, reason: 'invalid' }
	}

	try {
		const parsed: unknown = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
		if (!isAppointment(parsed)) return { ok: false, reason: 'invalid' }
		if (parsed.exp < now) return { ok: false, reason: 'expired' }
		return { ok: true, appointment: parsed }
	} catch {
		return { ok: false, reason: 'invalid' }
	}
}
