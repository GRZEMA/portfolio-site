import type { Appointment } from '@/lib/appointments/schema'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

export type CalendarDecision = 'accepted' | 'rejected'

type CalendarEvent = {
	id?: string
	status?: string
	htmlLink?: string
	summary?: string
	extendedProperties?: { private?: Record<string, string> }
}

type TokenCache = { accessToken: string; expiresAt: number }

let tokenCache: TokenCache | null = null

export function isCalendarConfigured(): boolean {
	return Boolean(
		process.env.GOOGLE_CLIENT_ID &&
			process.env.GOOGLE_CLIENT_SECRET &&
			process.env.GOOGLE_REFRESH_TOKEN
	)
}

function calendarId(): string {
	return process.env.GOOGLE_CALENDAR_ID || 'primary'
}

function organizerEmail(): string {
	const raw = process.env.CONTACT_TO_EMAIL ?? 'dawidkrzmnsk@gmail.com'
	const wrapped = raw.match(/<([^>]+)>/)
	return (wrapped?.[1] ?? raw).trim().toLowerCase()
}

function eventUrl(eventId?: string): string {
	const base = `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId())}/events`
	return eventId ? `${base}/${encodeURIComponent(eventId)}` : base
}

async function getAccessToken(): Promise<string> {
	if (!isCalendarConfigured()) {
		throw new Error('Google Calendar is not configured')
	}
	if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) {
		return tokenCache.accessToken
	}

	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID ?? '',
			client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN ?? '',
			grant_type: 'refresh_token',
		}),
		cache: 'no-store',
		signal: AbortSignal.timeout(10000),
	})

	const data = (await response.json()) as {
		access_token?: string
		expires_in?: number
		error?: string
		error_description?: string
	}

	if (!response.ok || !data.access_token) {
		throw new Error(
			data.error_description || data.error || 'Google token exchange failed'
		)
	}

	tokenCache = {
		accessToken: data.access_token,
		expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
	}
	return tokenCache.accessToken
}

export function decisionFromEvent(event: CalendarEvent | null): CalendarDecision | null {
	if (!event) return null
	const raw = event.extendedProperties?.private?.decision
	if (raw === 'accepted' || raw === 'rejected') return raw
	if (event.status === 'cancelled') return 'rejected'
	return 'accepted'
}

export async function getCalendarEvent(eventId: string): Promise<CalendarEvent | null> {
	const token = await getAccessToken()
	const response = await fetch(eventUrl(eventId), {
		headers: { Authorization: `Bearer ${token}` },
		cache: 'no-store',
		signal: AbortSignal.timeout(10000),
	})
	if (response.status === 404 || response.status === 410) return null
	if (!response.ok) {
		const detail = await response.text()
		throw new Error(`Calendar lookup failed (${response.status}): ${detail}`)
	}
	return (await response.json()) as CalendarEvent
}

async function insertEvent(
	eventId: string,
	body: Record<string, unknown>,
	sendUpdates: 'all' | 'none'
): Promise<{ created: boolean; event: CalendarEvent | null }> {
	const token = await getAccessToken()
	const url = new URL(eventUrl())
	url.searchParams.set('sendUpdates', sendUpdates)

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: eventId, ...body }),
		cache: 'no-store',
		signal: AbortSignal.timeout(15000),
	})

	if (response.status === 409) {
		const existing = await getCalendarEvent(eventId)
		return { created: false, event: existing }
	}

	if (!response.ok) {
		const detail = await response.text()
		throw new Error(`Google Calendar insert failed (${response.status}): ${detail}`)
	}

	return { created: true, event: (await response.json()) as CalendarEvent }
}

function eventTiming(appointment: Appointment) {
	return {
		start: { dateTime: appointment.start, timeZone: appointment.timeZone },
		end: { dateTime: appointment.end, timeZone: appointment.timeZone },
	}
}

function details(appointment: Appointment, note?: string): string {
	return [
		`Guest: ${appointment.name} <${appointment.email}>`,
		`Topic: ${appointment.topic}`,
		appointment.message ? `Note from guest:\n${appointment.message}` : '',
		note ? `Note from Dawid:\n${note}` : '',
		'',
		'Booked via dawidkrzeminski.com',
	]
		.filter((line) => line !== '')
		.join('\n')
}

export async function recordAccepted(appointment: Appointment, note?: string) {
	const summary = `Call with ${appointment.name}: ${appointment.topic}`.slice(0, 180)
	const result = await insertEvent(
		appointment.id,
		{
			summary,
			description: details(appointment, note),
			...eventTiming(appointment),
			attendees:
			appointment.email.toLowerCase() === organizerEmail()
				? undefined
				: [{ email: appointment.email }],
			guestsCanInviteOthers: false,
			guestsCanModify: false,
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'email', minutes: 24 * 60 },
					{ method: 'popup', minutes: 30 },
				],
			},
			extendedProperties: {
				private: { appointmentId: appointment.id, decision: 'accepted' },
			},
		},
		'all'
	)

	return {
		created: result.created,
		decision: decisionFromEvent(result.event) ?? 'accepted',
		htmlLink: result.event?.htmlLink,
	}
}

export async function recordRejected(appointment: Appointment, note?: string) {
	const result = await insertEvent(
		appointment.id,
		{
			summary: `Declined · ${appointment.name}`.slice(0, 180),
			description: [
				'Declined appointment request. Kept so the email buttons cannot be used again. This event is free and does not block the time.',
				'',
				details(appointment, note),
			].join('\n'),
			...eventTiming(appointment),
			transparency: 'transparent',
			visibility: 'private',
			colorId: '8',
			extendedProperties: {
				private: { appointmentId: appointment.id, decision: 'rejected' },
			},
		},
		'none'
	)

	return {
		created: result.created,
		decision: decisionFromEvent(result.event) ?? 'rejected',
	}
}
