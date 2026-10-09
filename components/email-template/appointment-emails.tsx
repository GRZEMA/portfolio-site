import { ReactNode } from 'react'
import type { AppointmentLocale } from '@/lib/appointments/constants'

type ShellProps = {
	preheader: string
	children: ReactNode
}

const EmailShell = ({ preheader, children }: ShellProps) => (
	<div
		style={{
			backgroundColor: '#F3F0E8',
			margin: 0,
			padding: '32px 16px',
			fontFamily: "Georgia, 'Iowan Old Style', Palatino, 'Palatino Linotype', serif",
		}}>
		<div
			style={{
				display: 'none',
				maxHeight: 0,
				overflow: 'hidden',
				color: '#F3F0E8',
			}}>
			{preheader}
		</div>
		<table
			role='presentation'
			cellPadding={0}
			cellSpacing={0}
			style={{
				width: '100%',
				maxWidth: 560,
				margin: '0 auto',
				backgroundColor: '#FFFFFF',
				borderCollapse: 'collapse',
				borderRadius: 20,
			}}>
			<tbody>
				<tr>
					<td style={{ height: 6, backgroundColor: '#3DFFC8', fontSize: 0, lineHeight: 0 }}>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td style={{ padding: '32px 32px 28px' }}>{children}</td>
				</tr>
			</tbody>
		</table>
		<p
			style={{
				maxWidth: 560,
				margin: '16px auto 0',
				color: '#8A8478',
				fontFamily: "Georgia, Palatino, serif",
				fontSize: 12,
				lineHeight: '18px',
				textAlign: 'center',
			}}>
			Dawid Krzemiński · dawidkrzeminski.com
		</p>
	</div>
)

const Eyebrow = ({ children }: { children: ReactNode }) => (
	<p
		style={{
			margin: '0 0 8px',
			color: '#0E8F72',
			fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
			fontSize: 12,
			fontWeight: 700,
			letterSpacing: '0.16em',
			textTransform: 'uppercase',
		}}>
		{children}
	</p>
)

const Heading = ({ children }: { children: ReactNode }) => (
	<h1
		style={{
			margin: '0 0 12px',
			color: '#121826',
			fontSize: 28,
			lineHeight: '34px',
			fontWeight: 700,
		}}>
		{children}
	</h1>
)

const Paragraph = ({ children }: { children: ReactNode }) => (
	<p
		style={{
			margin: '0 0 20px',
			color: '#3C4553',
			fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
			fontSize: 15,
			lineHeight: '24px',
		}}>
		{children}
	</p>
)

const DetailRow = ({ label, value }: { label: string; value: string }) => (
	<tr>
		<td
			style={{
				padding: '8px 0',
				color: '#6B7280',
				fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
				fontSize: 13,
				width: 110,
				verticalAlign: 'top',
			}}>
			{label}
		</td>
		<td
			style={{
				padding: '8px 0',
				color: '#121826',
				fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
				fontSize: 15,
				lineHeight: '22px',
				verticalAlign: 'top',
			}}>
			{value.split('\n').map((line, index) => (
				<span key={`${label}-${index}`}>
					{index > 0 ? <br /> : null}
					{line}
				</span>
			))}
		</td>
	</tr>
)

const Details = ({
	rows,
}: {
	rows: { label: string; value: string }[]
}) => (
	<table
		role='presentation'
		cellPadding={0}
		cellSpacing={0}
		style={{
			width: '100%',
			margin: '0 0 24px',
			backgroundColor: '#F7F6F2',
			borderRadius: 14,
		}}>
		<tbody>
			<tr>
				<td style={{ padding: '8px 18px' }}>
					<table role='presentation' cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
						<tbody>
							{rows.map((row) => (
								<DetailRow key={row.label} label={row.label} value={row.value} />
							))}
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
)

const ActionButton = ({
	href,
	label,
	kind,
}: {
	href: string
	label: string
	kind: 'accept' | 'decline'
}) => (
	<a
		href={href}
		style={{
			display: 'inline-block',
			backgroundColor: kind === 'accept' ? '#3DFFC8' : '#1F2937',
			color: kind === 'accept' ? '#07140F' : '#FFFFFF',
			fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
			fontSize: 15,
			fontWeight: 700,
			lineHeight: '20px',
			textDecoration: 'none',
			padding: '14px 26px',
			borderRadius: 999,
		}}>
		{label}
	</a>
)

const copy = {
	en: {
		requestEyebrow: 'New request',
		requestTitle: 'Someone wants to meet',
		requestBody: 'Nothing is on your calendar yet. Accept to add it and email them a confirmation, or decline and they’ll be told this time doesn’t work.',
		receivedEyebrow: 'Request received',
		receivedTitle: 'I have your request',
		receivedBody: 'This time isn’t reserved yet. I’ll email you when I accept or decline.',
		acceptedEyebrow: 'Confirmed',
		acceptedTitle: 'Your appointment is confirmed',
		acceptedBody: 'It’s on my calendar. A Google Calendar invitation is also on its way to this inbox.',
		rejectedEyebrow: 'Update',
		rejectedTitle: 'I can’t make that time',
		rejectedBody: 'Thanks for asking. That slot doesn’t work — you’re welcome to request another evening or weekend.',
		accept: 'Accept',
		decline: 'Decline',
		safety: 'These buttons open a confirmation page, so a mail scanner can’t accept or decline by itself.',
		another: 'Request another time',
		from: 'From',
		when: 'When',
		duration: 'Length',
		topic: 'Topic',
		note: 'Note',
		yourNote: 'Note from Dawid',
		minutes: 'min',
	},
	pl: {
		requestEyebrow: 'Nowa prośba',
		requestTitle: 'Ktoś chce się spotkać',
		requestBody: 'Na kalendarzu jeszcze nic nie ma. Przyjmij, żeby dodać termin i wysłać potwierdzenie, albo odrzuć — wtedy dostaną maila, że ten czas nie pasuje.',
		receivedEyebrow: 'Prośba dotarła',
		receivedTitle: 'Mam Twoją prośbę',
		receivedBody: 'Ten termin nie jest jeszcze zarezerwowany. Napiszę, gdy go przyjmę albo odrzucę.',
		acceptedEyebrow: 'Potwierdzone',
		acceptedTitle: 'Spotkanie jest potwierdzone',
		acceptedBody: 'Jest już w moim kalendarzu. Na tę skrzynkę przyjdzie też zaproszenie z Google Calendar.',
		rejectedEyebrow: 'Aktualizacja',
		rejectedTitle: 'Nie dam rady w tym terminie',
		rejectedBody: 'Dzięki za propozycję. Ten slot nie pasuje — możesz wybrać inny wieczór albo weekend.',
		accept: 'Przyjmij',
		decline: 'Odrzuć',
		safety: 'Przyciski otwierają stronę potwierdzenia, żeby skaner poczty sam nie podjął decyzji.',
		another: 'Zaproponuj inny termin',
		from: 'Od',
		when: 'Kiedy',
		duration: 'Czas',
		topic: 'Temat',
		note: 'Notatka',
		yourNote: 'Notatka od Dawida',
		minutes: 'min',
	},
} as const

export type AppointmentEmailDetails = {
	locale: AppointmentLocale
	name: string
	email: string
	dateLabel: string
	timeLabel: string
	timeZone: string
	durationMinutes: number
	topic: string
	message: string
}

const whenValue = (details: AppointmentEmailDetails) =>
	`${details.dateLabel}, ${details.timeLabel} (${details.timeZone})`

export const OwnerRequestEmail = ({
	details,
	acceptUrl,
	rejectUrl,
}: {
	details: AppointmentEmailDetails
	acceptUrl: string
	rejectUrl: string
}) => {
	const text = copy.en
	const rows = [
		{ label: text.from, value: `${details.name} · ${details.email}` },
		{ label: text.when, value: whenValue(details) },
		{ label: text.duration, value: `${details.durationMinutes} ${text.minutes}` },
		{ label: text.topic, value: details.topic },
		...(details.message ? [{ label: text.note, value: details.message }] : []),
	]

	return (
		<EmailShell preheader={`${details.name} requested ${details.dateLabel} at ${details.timeLabel}`}>
			<Eyebrow>{text.requestEyebrow}</Eyebrow>
			<Heading>{text.requestTitle}</Heading>
			<Paragraph>{text.requestBody}</Paragraph>
			<Details rows={rows} />
			<table role='presentation' cellPadding={0} cellSpacing={0} style={{ margin: '0 0 16px' }}>
				<tbody>
					<tr>
						<td style={{ padding: '0 12px 12px 0' }}>
							<ActionButton href={acceptUrl} label={text.accept} kind='accept' />
						</td>
						<td style={{ padding: '0 0 12px' }}>
							<ActionButton href={rejectUrl} label={text.decline} kind='decline' />
						</td>
					</tr>
				</tbody>
			</table>
			<Paragraph>{text.safety}</Paragraph>
		</EmailShell>
	)
}

export const GuestReceivedEmail = ({
	details,
}: {
	details: AppointmentEmailDetails
}) => {
	const text = copy[details.locale]
	return (
		<EmailShell preheader={text.receivedBody}>
			<Eyebrow>{text.receivedEyebrow}</Eyebrow>
			<Heading>{text.receivedTitle}</Heading>
			<Paragraph>
				{details.locale === 'pl' ? `Cześć ${details.name},` : `Hi ${details.name},`}
			</Paragraph>
			<Paragraph>{text.receivedBody}</Paragraph>
			<Details
				rows={[
					{ label: text.when, value: whenValue(details) },
					{ label: text.duration, value: `${details.durationMinutes} ${text.minutes}` },
					{ label: text.topic, value: details.topic },
				]}
			/>
		</EmailShell>
	)
}

export const GuestDecisionEmail = ({
	details,
	decision,
	note,
	appointmentsUrl,
}: {
	details: AppointmentEmailDetails
	decision: 'accepted' | 'rejected'
	note?: string
	appointmentsUrl: string
}) => {
	const text = copy[details.locale]
	const accepted = decision === 'accepted'
	return (
		<EmailShell preheader={accepted ? text.acceptedBody : text.rejectedBody}>
			<Eyebrow>{accepted ? text.acceptedEyebrow : text.rejectedEyebrow}</Eyebrow>
			<Heading>{accepted ? text.acceptedTitle : text.rejectedTitle}</Heading>
			<Paragraph>
				{details.locale === 'pl' ? `Cześć ${details.name},` : `Hi ${details.name},`}
			</Paragraph>
			<Paragraph>{accepted ? text.acceptedBody : text.rejectedBody}</Paragraph>
			<Details
				rows={[
					{ label: text.when, value: whenValue(details) },
					{ label: text.topic, value: details.topic },
					...(note ? [{ label: text.yourNote, value: note }] : []),
				]}
			/>
			{accepted ? null : (
				<ActionButton href={appointmentsUrl} label={text.another} kind='accept' />
			)}
		</EmailShell>
	)
}
