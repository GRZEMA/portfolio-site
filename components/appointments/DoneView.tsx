'use client'

import { useTranslation } from 'react-i18next'
import Button from '@/components/multi-page-components/UI/Button'
import type { AppointmentResult } from '@/lib/appointments/results'

const toneFor = (result: AppointmentResult) => {
	if (result === 'accepted' || result === 'rejected' || result.startsWith('already-')) return 'ok'
	if (result === 'calendar-missing' || result.endsWith('email-failed')) return 'warn'
	return 'bad'
}

const DoneView = ({ result }: { result: AppointmentResult }): JSX.Element => {
	const { t } = useTranslation()
	const tone = toneFor(result)
	const key = result

	return (
		<main className='px-4 pb-24 pt-36 text-text'>
			<div className='mx-auto max-w-lg rounded-3xl border border-line bg-surface p-8 text-center sm:p-10'>
				<p
					className={`font-display text-3xl font-bold ${
						tone === 'ok' ? 'text-signal' : tone === 'warn' ? 'text-sand' : 'text-red-400'
					}`}>
					{t(`appointments.done.${key}Title`)}
				</p>
				<p className='mt-4 text-muted'>{t(`appointments.done.${key}Body`)}</p>
				<div className='mt-8 flex justify-center'>
					<Button href='/'>{t('appointments.done.back')}</Button>
				</div>
			</div>
		</main>
	)
}

export default DoneView
