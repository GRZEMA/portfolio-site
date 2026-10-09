'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Button from '@/components/multi-page-components/UI/Button'
import {
	DURATIONS,
	OWNER_TIME_ZONE,
	addDays,
	formatWhen,
	listSlots,
	todayInZone,
	zonedLocalToUtc,
	type DurationMinutes,
} from '@/lib/appointments/constants'

const inputClasses =
	'w-full rounded-2xl border border-line bg-elevated px-4 py-3.5 text-base text-text placeholder:text-muted/70 outline-none transition-colors focus:border-signal'

const AppointmentPage = (): JSX.Element => {
	const { t, i18n } = useTranslation()
	const [now, setNow] = useState<Date | null>(null)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [date, setDate] = useState('')
	const [time, setTime] = useState('')
	const [duration, setDuration] = useState<DurationMinutes>(30)
	const [topic, setTopic] = useState('')
	const [message, setMessage] = useState('')
	const [website, setWebsite] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	useEffect(() => {
		const current = new Date()
		setNow(current)
		let cursor = todayInZone(OWNER_TIME_ZONE, current)
		for (let day = 0; day < 21; day += 1) {
			if (listSlots(cursor, current).length > 0) {
				setDate(cursor)
				break
			}
			cursor = addDays(cursor, 1)
		}
	}, [])

	const slots = now && date ? listSlots(date, now) : []
	const locale = i18n.language?.startsWith('pl') ? 'pl' : 'en'
	const minDate = now ? todayInZone(OWNER_TIME_ZONE, now) : undefined
	const maxDate = minDate ? addDays(minDate, 90) : undefined

	useEffect(() => {
		if (!now || !date) return
		setTime((current) => (current && listSlots(date, now).includes(current) ? current : ''))
	}, [date, now])

	const preview = useMemo(() => {
		if (!date || !time) return null
		const start = zonedLocalToUtc(date, time, OWNER_TIME_ZONE)
		const end = new Date(start.getTime() + duration * 60 * 1000)
		return formatWhen(start.toISOString(), end.toISOString(), OWNER_TIME_ZONE, locale)
	}, [date, time, duration, locale])

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault()
		setError('')
		if (!time) {
			setError(t('appointments.pickTime'))
			return
		}
		setIsLoading(true)
		try {
			const response = await fetch('/api/appointments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					date,
					time,
					durationMinutes: duration,
					topic,
					message,
					locale,
					website,
				}),
			})
			const data: { data?: string; code?: string; error?: string } = await response.json()
			if (response.ok && data.data) {
				setSent(true)
				return
			}
			const code = data.code || 'unexpected'
			setError(t(`appointments.errors.${code}`, { defaultValue: data.error || t('appointments.errors.unexpected') }))
		} catch {
			setError(t('appointments.errors.unexpected'))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main className='text-text'>
			<section className='relative overflow-hidden bg-mesh-hero pb-12 pt-32 sm:pb-16 sm:pt-40'>
				<div className='container relative z-10 max-w-6xl'>
					<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
						<p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
							{t('appointments.eyebrow')}
						</p>
						<h1 className='max-w-3xl font-display text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl'>
							{t('appointments.title')}
						</h1>
						<p className='mt-6 max-w-2xl text-lg text-muted'>{t('appointments.subtitle')}</p>
					</motion.div>
				</div>
			</section>

			<section className='py-16 sm:py-20'>
				<div className='container max-w-3xl'>
					{sent ? (
						<div className='rounded-3xl border border-line bg-surface p-8 text-center sm:p-12'>
							<p className='font-display text-3xl font-bold text-signal'>
								{t('appointments.successTitle')}
							</p>
							<p className='mx-auto mt-4 max-w-md text-muted'>{t('appointments.successBody')}</p>
							<div className='mt-8'>
								<Button
									action={() => {
										setSent(false)
										setTopic('')
										setMessage('')
										setTime('')
									}}>
									{t('appointments.another')}
								</Button>
							</div>
						</div>
					) : (
						<motion.form
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							onSubmit={onSubmit}
							className='relative flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:p-10'>
							<p className='text-sm leading-relaxed text-muted'>{t('appointments.availability')}</p>
							<div className='absolute left-[-9999px] top-auto h-px w-px overflow-hidden' aria-hidden='true'>
								<label>
									Website
									<input
										value={website}
										onChange={(event) => setWebsite(event.target.value)}
										tabIndex={-1}
										autoComplete='off'
									/>
								</label>
							</div>
							<div className='grid gap-4 sm:grid-cols-2'>
								<label className='block'>
									<span className='mb-2 block text-sm font-medium text-muted'>
										{t('appointments.name')}
									</span>
									<input
										required
										minLength={2}
										maxLength={80}
										autoComplete='name'
										value={name}
										onChange={(event) => setName(event.target.value)}
										className={inputClasses}
									/>
								</label>
								<label className='block'>
									<span className='mb-2 block text-sm font-medium text-muted'>
										{t('appointments.email')}
									</span>
									<input
										required
										type='email'
										maxLength={120}
										autoComplete='email'
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										className={inputClasses}
									/>
								</label>
							</div>
							<label className='block'>
								<span className='mb-2 block text-sm font-medium text-muted'>
									{t('appointments.date')}
								</span>
								<input
									required
									type='date'
									value={date}
									min={minDate}
									max={maxDate}
									onChange={(event) => setDate(event.target.value)}
									className={inputClasses}
								/>
							</label>
							<div>
								<span className='mb-2 block text-sm font-medium text-muted'>
									{t('appointments.duration')}
								</span>
								<div className='flex flex-wrap gap-2'>
									{DURATIONS.map((option) => (
										<button
											key={option}
											type='button'
											onClick={() => setDuration(option)}
											className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
												duration === option
													? 'bg-signal text-ink'
													: 'border border-line bg-elevated text-text hover:border-signal'
											}`}>
											{t('appointments.minutes', { count: option })}
										</button>
									))}
								</div>
							</div>
							<div>
								<span className='mb-2 block text-sm font-medium text-muted'>
									{t('appointments.time')}
								</span>
								{now && slots.length === 0 ? (
									<p className='text-sm text-muted'>{t('appointments.noSlots')}</p>
								) : (
									<div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
										{slots.map((slot) => (
											<button
												key={slot}
												type='button'
												aria-pressed={time === slot}
												onClick={() => setTime(slot)}
												className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
													time === slot
														? 'bg-signal text-ink'
														: 'border border-line bg-elevated text-text hover:border-signal'
												}`}>
												{slot}
											</button>
										))}
									</div>
								)}
							</div>
							<label className='block'>
								<span className='mb-2 block text-sm font-medium text-muted'>
									{t('appointments.topic')}
								</span>
								<input
									required
									minLength={3}
									maxLength={140}
									value={topic}
									onChange={(event) => setTopic(event.target.value)}
									className={inputClasses}
								/>
							</label>
							<label className='block'>
								<span className='mb-2 block text-sm font-medium text-muted'>
									{t('appointments.message')}
								</span>
								<textarea
									maxLength={1000}
									value={message}
									onChange={(event) => setMessage(event.target.value)}
									className={`${inputClasses} min-h-[140px] resize-y`}
								/>
							</label>
							{preview ? (
								<p className='rounded-2xl border border-line bg-elevated px-4 py-3 text-sm text-sand'>
									{preview.dateLabel}
									<span className='text-muted'> · </span>
									{preview.timeLabel}
									<span className='text-muted'> · {preview.timeZone}</span>
								</p>
							) : null}
							{error ? (
								<p className='text-center text-sm text-red-400' role='alert'>
									{error}
								</p>
							) : null}
							<div className='flex justify-center pt-2'>
								<Button type='submit' size='lg' disabled={isLoading || !now}>
									{isLoading ? t('appointments.sending') : t('appointments.submit')}
								</Button>
							</div>
						</motion.form>
					)}
				</div>
			</section>
		</main>
	)
}

export default AppointmentPage
