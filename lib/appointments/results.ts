export const APPOINTMENT_RESULTS = [
	'accepted',
	'rejected',
	'already-accepted',
	'already-rejected',
	'calendar-missing',
	'accepted-email-failed',
	'rejected-email-failed',
	'expired',
	'invalid',
	'error',
] as const

export type AppointmentResult = (typeof APPOINTMENT_RESULTS)[number]

export function isAppointmentResult(value: string): value is AppointmentResult {
	return (APPOINTMENT_RESULTS as readonly string[]).includes(value)
}
