import {
	type AppointmentLocale,
	type DurationMinutes,
	MAX_HORIZON_DAYS,
	TOKEN_TTL_MS,
	OWNER_TIME_ZONE,
	addDays,
	isDuration,
	isRealDate,
	listSlots,
	todayInZone,
	zonedLocalToUtc,
} from '@/lib/appointments/constants'

export type AppointmentInput = {
	name: string
	email: string
	date: string
	time: string
	durationMinutes: DurationMinutes
	topic: string
	message: string
	locale: AppointmentLocale
}

export type Appointment = AppointmentInput & {
	id: string
	start: string
	end: string
	timeZone: string
	createdAt: string
	exp: number
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanLine(value: unknown, max: number): string {
	if (typeof value !== 'string') return ''
	return value
		.replace(/[\u0000-\u001F\u007F]/g, '')
		.trim()
		.slice(0, max)
}

function cleanMessage(value: unknown, max: number): string {
	if (typeof value !== 'string') return ''
	return value.replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)
}

export function parseAppointmentInput(
	body: unknown,
	now = new Date()
): { ok: true; value: AppointmentInput } | { ok: false; code: string } {
	if (!body || typeof body !== 'object') return { ok: false, code: 'invalid' }
	const raw = body as Record<string, unknown>

	const name = cleanLine(raw.name, 80)
	const email = cleanLine(raw.email, 120).toLowerCase()
	const date = cleanLine(raw.date, 10)
	const time = cleanLine(raw.time, 5)
	const topic = cleanLine(raw.topic, 140)
	const message = cleanMessage(raw.message, 1000)
	const locale: AppointmentLocale = raw.locale === 'pl' ? 'pl' : 'en'
	const duration = Number(raw.durationMinutes)

	if (name.length < 2 || topic.length < 3) return { ok: false, code: 'invalid' }
	if (!EMAIL_PATTERN.test(email)) return { ok: false, code: 'invalid-email' }
	if (!isRealDate(date) || !/^\d{2}:\d{2}$/.test(time)) {
		return { ok: false, code: 'invalid-time' }
	}
	if (!isDuration(duration)) return { ok: false, code: 'invalid' }

	const today = todayInZone(OWNER_TIME_ZONE, now)
	if (date < today || date > addDays(today, MAX_HORIZON_DAYS)) {
		return { ok: false, code: 'invalid-time' }
	}
	if (!listSlots(date, now).includes(time)) {
		return { ok: false, code: 'invalid-time' }
	}

	return {
		ok: true,
		value: {
			name,
			email,
			date,
			time,
			durationMinutes: duration,
			topic,
			message,
			locale,
		},
	}
}

export function toAppointment(
	input: AppointmentInput,
	id: string,
	now = new Date()
): Appointment {
	const start = zonedLocalToUtc(input.date, input.time, OWNER_TIME_ZONE)
	const end = new Date(start.getTime() + input.durationMinutes * 60 * 1000)
	return {
		...input,
		id,
		start: start.toISOString(),
		end: end.toISOString(),
		timeZone: OWNER_TIME_ZONE,
		createdAt: now.toISOString(),
		exp: now.getTime() + TOKEN_TTL_MS,
	}
}
