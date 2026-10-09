import { ReactElement } from 'react'
import { Resend } from 'resend'
import {
	GuestDecisionEmail,
	GuestReceivedEmail,
	OwnerRequestEmail,
	type AppointmentEmailDetails,
} from '@/components/email-template/appointment-emails'
import { formatWhen } from '@/lib/appointments/constants'
import type { Appointment } from '@/lib/appointments/schema'

const fromEmail = () =>
	process.env.RESEND_FROM_EMAIL ?? 'Portfolio <noreply@dawidkrzeminski.com>'

export const ownerEmail = () =>
	process.env.CONTACT_TO_EMAIL ?? 'dawidkrzmnsk@gmail.com'

function resendClient() {
	const key = process.env.RESEND_API_KEY
	if (!key) throw new Error('Email service is not configured')
	return new Resend(key)
}

export function appointmentDetails(
	appointment: Appointment,
	locale: Appointment['locale'] = appointment.locale
): AppointmentEmailDetails {
	const when = formatWhen(appointment.start, appointment.end, appointment.timeZone, locale)
	return {
		locale,
		name: appointment.name,
		email: appointment.email,
		dateLabel: when.dateLabel,
		timeLabel: when.timeLabel,
		timeZone: when.timeZone,
		durationMinutes: appointment.durationMinutes,
		topic: appointment.topic,
		message: appointment.message,
	}
}

export function actionLinks(siteUrl: string, token: string) {
	const accept = new URL('/appointments/respond', siteUrl)
	const reject = new URL('/appointments/respond', siteUrl)
	accept.searchParams.set('token', token)
	accept.searchParams.set('action', 'accept')
	reject.searchParams.set('token', token)
	reject.searchParams.set('action', 'reject')
	return { acceptUrl: accept.toString(), rejectUrl: reject.toString() }
}

async function send(input: {
	to: string
	subject: string
	replyTo?: string
	react: ReactElement
	text: string
}) {
	const { error } = await resendClient().emails.send({
		from: fromEmail(),
		to: [input.to],
		replyTo: input.replyTo,
		subject: input.subject,
		react: input.react,
		text: input.text,
	})
	if (error) throw new Error(error.message)
}

export async function sendOwnerRequest(appointment: Appointment, token: string, siteUrl: string) {
	const details = appointmentDetails(appointment, 'en')
	const links = actionLinks(siteUrl, token)
	const text = [
		`New appointment request from ${details.name} <${details.email}>`,
		`${details.dateLabel}, ${details.timeLabel} (${details.timeZone})`,
		`${details.durationMinutes} min`,
		`Topic: ${details.topic}`,
		details.message ? `Note: ${details.message}` : '',
		'',
		`Accept: ${links.acceptUrl}`,
		`Decline: ${links.rejectUrl}`,
	]
		.filter((line) => line !== '')
		.join('\n')

	await send({
		to: ownerEmail(),
		replyTo: appointment.email,
		subject: `Appointment request: ${details.name} — ${details.dateLabel}`,
		react: OwnerRequestEmail({ details, ...links }),
		text,
	})
}

export async function sendGuestReceived(appointment: Appointment) {
	const details = appointmentDetails(appointment)
	const polish = appointment.locale === 'pl'
	const text = polish
		? `Cześć ${details.name},\n\nMam Twoją prośbę o spotkanie ${details.dateLabel}, ${details.timeLabel} (${details.timeZone}). Termin nie jest jeszcze zarezerwowany — napiszę, gdy go przyjmę albo odrzucę.\n\nTemat: ${details.topic}`
		: `Hi ${details.name},\n\nI have your appointment request for ${details.dateLabel}, ${details.timeLabel} (${details.timeZone}). It isn’t reserved yet — I’ll email you when I accept or decline.\n\nTopic: ${details.topic}`

	await send({
		to: appointment.email,
		replyTo: ownerEmail(),
		subject: polish ? 'Prośba o spotkanie dotarła' : 'Appointment request received',
		react: GuestReceivedEmail({ details }),
		text,
	})
}

export async function sendGuestDecision(
	appointment: Appointment,
	decision: 'accepted' | 'rejected',
	siteUrl: string,
	note?: string
) {
	const details = appointmentDetails(appointment)
	const polish = appointment.locale === 'pl'
	const appointmentsUrl = new URL('/appointments', siteUrl).toString()
	const accepted = decision === 'accepted'
	const subject = accepted
		? polish
			? 'Spotkanie potwierdzone'
			: 'Your appointment is confirmed'
		: polish
			? 'Ten termin nie pasuje'
			: 'That appointment time doesn’t work'

	const text = [
		polish ? `Cześć ${details.name},` : `Hi ${details.name},`,
		'',
		accepted
			? polish
				? `Spotkanie ${details.dateLabel}, ${details.timeLabel} (${details.timeZone}) jest potwierdzone. Zaproszenie z Google Calendar przyjdzie osobno.`
				: `Your appointment on ${details.dateLabel}, ${details.timeLabel} (${details.timeZone}) is confirmed. A Google Calendar invitation is on its way.`
			: polish
				? `Nie dam rady ${details.dateLabel}, ${details.timeLabel}. Możesz zaproponować inny termin: ${appointmentsUrl}`
				: `I can’t make ${details.dateLabel}, ${details.timeLabel}. You can request another time: ${appointmentsUrl}`,
		note ? `\n${note}` : '',
	].join('\n')

	await send({
		to: appointment.email,
		replyTo: ownerEmail(),
		subject,
		react: GuestDecisionEmail({ details, decision, note, appointmentsUrl }),
		text,
	})
}
