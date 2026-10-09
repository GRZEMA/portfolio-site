export const OWNER_TIME_ZONE = 'Europe/Warsaw'
export const DURATIONS = [30, 45, 60] as const
export const MIN_LEAD_MS = 2 * 60 * 60 * 1000
export const MAX_HORIZON_DAYS = 90
export const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000

export type DurationMinutes = (typeof DURATIONS)[number]
export type AppointmentLocale = 'en' | 'pl'

const WEEKDAY_STARTS = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
const WEEKEND_STARTS = [
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
	'17:30',
	'18:00',
]

export function isDuration(value: number): value is DurationMinutes {
	return DURATIONS.includes(value as DurationMinutes)
}

export function isRealDate(date: string): boolean {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
	if (!match) return false
	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])
	const utc = new Date(Date.UTC(year, month - 1, day))
	return (
		utc.getUTCFullYear() === year &&
		utc.getUTCMonth() === month - 1 &&
		utc.getUTCDate() === day
	)
}

/** Offset of `timeZone` at `instant`: wall-clock-as-UTC minus the real UTC instant. */
export function timeZoneOffsetMs(instant: Date, timeZone: string): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).formatToParts(instant)

	const map: Record<string, string> = {}
	for (const part of parts) {
		if (part.type !== 'literal') map[part.type] = part.value
	}

	const asUtc = Date.UTC(
		Number(map.year),
		Number(map.month) - 1,
		Number(map.day),
		Number(map.hour) % 24,
		Number(map.minute),
		Number(map.second)
	)
	return asUtc - instant.getTime()
}

/** Convert a wall-clock date and time in `timeZone` to a UTC Date. */
export function zonedLocalToUtc(
	date: string,
	time: string,
	timeZone: string
): Date {
	const [year, month, day] = date.split('-').map(Number)
	const [hour, minute] = time.split(':').map(Number)
	const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
	const firstPass = new Date(
		utcGuess.getTime() - timeZoneOffsetMs(utcGuess, timeZone)
	)
	return new Date(
		utcGuess.getTime() - timeZoneOffsetMs(firstPass, timeZone)
	)
}

export function todayInZone(timeZone: string, now = new Date()): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(now)
}

export function addDays(date: string, days: number): string {
	const [year, month, day] = date.split('-').map(Number)
	const utc = new Date(Date.UTC(year, month - 1, day + days))
	return utc.toISOString().slice(0, 10)
}

export function weekdayIndex(date: string, timeZone: string): number {
	const noon = zonedLocalToUtc(date, '12:00', timeZone)
	const label = new Intl.DateTimeFormat('en-US', {
		timeZone,
		weekday: 'short',
	}).format(noon)
	const map: Record<string, number> = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6,
	}
	return map[label] ?? 0
}

export function startTimesForDate(date: string): string[] {
	if (!isRealDate(date)) return []
	const day = weekdayIndex(date, OWNER_TIME_ZONE)
	const weekend = day === 0 || day === 6
	return weekend ? WEEKEND_STARTS : WEEKDAY_STARTS
}

export function listSlots(date: string, now = new Date()): string[] {
	if (!isRealDate(date)) return []
	const today = todayInZone(OWNER_TIME_ZONE, now)
	const lastDay = addDays(today, MAX_HORIZON_DAYS)
	if (date < today || date > lastDay) return []

	const earliest = now.getTime() + MIN_LEAD_MS
	return startTimesForDate(date).filter((time) => {
		return zonedLocalToUtc(date, time, OWNER_TIME_ZONE).getTime() >= earliest
	})
}

export function formatWhen(
	startIso: string,
	endIso: string,
	timeZone: string,
	locale: AppointmentLocale
) {
	const start = new Date(startIso)
	const end = new Date(endIso)
	const dateLabel = new Intl.DateTimeFormat(locale, {
		timeZone,
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(start)
	const timeFormatter = new Intl.DateTimeFormat(locale, {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	})
	return {
		dateLabel,
		timeLabel: `${timeFormatter.format(start)}–${timeFormatter.format(end)}`,
		timeZone,
	}
}
