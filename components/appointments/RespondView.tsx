'use client'

import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/multi-page-components/UI/Button'
import { formatWhen, type AppointmentLocale } from '@/lib/appointments/constants'

export type RespondAppointment = {
	name: string
	email: string
	topic: string
	message: string
	start: string
	end: string
	timeZone: string
	durationMinutes: number
}

type ReadyProps = {
	status: 'ready'
	action: 'accept' | 'reject' | 'choose'
	token: string
	appointment: RespondAppointment
}

type Props = ReadyProps | { status: 'invalid' | 'expired' }

const RespondView = (props: Props): JSX.Element => {
	const { t, i18n } = useTranslation()
	const locale: AppointmentLocale = i18n.language?.startsWith('pl') ? 'pl' : 'en'
	const [note, setNote] = useState('')
	const [pending, setPending] = useState<'accept' | 'reject' | null>(null)

	if (props.status !== 'ready') {
		const expired = props.status === 'expired'
		return (
			<main className='px-4 pb-24 pt-36 text-text'>
				<div className='mx-auto max-w-lg rounded-3xl border border-line bg-surface p-8 text-center sm:p-10'>
					<h1 className='font-display text-3xl font-bold'>
						{expired ? t('appointments.respond.expiredTitle') : t('appointments.respond.invalidTitle')}
					</h1>
					<p className='mt-4 text-muted'>
						{expired ? t('appointments.respond.expiredBody') : t('appointments.respond.invalidBody')}
					</p>
				</div>
			</main>
		)
	}

	const { appointment, action, token } = props
	const when = formatWhen(appointment.start, appointment.end, appointment.timeZone, locale)
	const primary: 'accept' | 'reject' = action === 'reject' ? 'reject' : 'accept'
	const showBoth = action === 'choose'

	const submit = (event: FormEvent<HTMLFormElement>) => {
		const chosen = new FormData(event.currentTarget).get('action')
		if (chosen === 'accept' || chosen === 'reject') setPending(chosen)
	}

	return (
		<main className='px-4 pb-24 pt-36 text-text'>
			<div className='mx-auto max-w-xl rounded-3xl border border-line bg-surface p-6 sm:p-10'>
				<p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
					{t('appointments.eyebrow')}
				</p>
				<h1 className='font-display text-3xl font-bold sm:text-4xl'>
					{primary === 'accept' && !showBoth
						? t('appointments.respond.acceptTitle')
						: !showBoth
							? t('appointments.respond.rejectTitle')
							: t('appointments.respond.chooseTitle')}
				</h1>
				<p className='mt-4 text-muted'>
					{primary === 'accept' && !showBoth
						? t('appointments.respond.acceptBody')
						: !showBoth
							? t('appointments.respond.rejectBody')
							: t('appointments.respond.chooseBody')}
				</p>
				<dl className='mt-8 space-y-4 rounded-2xl border border-line bg-elevated p-5'>
					<div>
						<dt className='text-xs uppercase tracking-wider text-muted'>
							{t('appointments.respond.from')}
						</dt>
						<dd className='mt-1 text-text'>
							{appointment.name}
							<span className='block text-sm text-sand'>{appointment.email}</span>
						</dd>
					</div>
					<div>
						<dt className='text-xs uppercase tracking-wider text-muted'>
							{t('appointments.respond.when')}
						</dt>
						<dd className='mt-1 text-text'>
							{when.dateLabel}
							<span className='block text-sm text-sand'>
								{when.timeLabel} · {when.timeZone} · {appointment.durationMinutes} min
							</span>
						</dd>
					</div>
					<div>
						<dt className='text-xs uppercase tracking-wider text-muted'>
							{t('appointments.respond.topic')}
						</dt>
						<dd className='mt-1 text-text'>{appointment.topic}</dd>
					</div>
					{appointment.message ? (
						<div>
							<dt className='text-xs uppercase tracking-wider text-muted'>
								{t('appointments.respond.noteLabel')}
							</dt>
							<dd className='mt-1 whitespace-pre-wrap text-text'>{appointment.message}</dd>
						</div>
					) : null}
				</dl>
				<form method='post' action='/api/appointments/respond' onSubmit={submit} className='mt-8'>
					<input type='hidden' name='token' value={token} />
					<label className='block'>
						<span className='mb-2 block text-sm font-medium text-muted'>
							{t('appointments.respond.note')}
						</span>
						<textarea
							name='note'
							maxLength={500}
							value={note}
							onChange={(event) => setNote(event.target.value)}
							className='w-full rounded-2xl border border-line bg-elevated px-4 py-3.5 text-base text-text outline-none transition-colors focus:border-signal min-h-[100px] resize-y'
						/>
					</label>
					<div className='mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row'>
						{showBoth ? (
							<>
								<button
									type='submit'
									name='action'
									value='accept'
									disabled={pending !== null}
									className='inline-flex items-center justify-center rounded-full bg-signal px-6 py-3.5 text-base font-semibold text-ink transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50'>
									{pending === 'accept'
										? t('appointments.sending')
										: t('appointments.respond.confirmAccept')}
								</button>
								<button
									type='submit'
									name='action'
									value='reject'
									disabled={pending !== null}
									className='inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-base font-semibold text-text transition-all hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50'>
									{pending === 'reject'
										? t('appointments.sending')
										: t('appointments.respond.confirmReject')}
								</button>
							</>
						) : (
							<>
								<input type='hidden' name='action' value={primary} />
								<Button type='submit' size='lg' variant={primary === 'reject' ? 'ghost' : 'primary'} disabled={pending !== null}>
									{pending
										? t('appointments.sending')
										: primary === 'accept'
											? t('appointments.respond.confirmAccept')
											: t('appointments.respond.confirmReject')}
								</Button>
							</>
						)}
					</div>
				</form>
				{!showBoth ? (
					<p className='mt-6 text-center text-sm text-muted'>
						<a
							className='text-signal hover:underline'
							href={`/appointments/respond?token=${encodeURIComponent(token)}&action=${
								primary === 'accept' ? 'reject' : 'accept'
							}`}>
							{primary === 'accept'
								? t('appointments.respond.switchReject')
								: t('appointments.respond.switchAccept')}
						</a>
					</p>
				) : null}
			</div>
		</main>
	)
}

export default RespondView
