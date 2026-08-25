'use client'

import { FormEvent, useRef, useContext, useState } from 'react'
import Button from '../../multi-page-components/UI/Button'
import { motion } from 'framer-motion'
import { ModalContext } from '@/app/store/modal-context'
import { useTranslation } from 'react-i18next'

const ContactFormSection = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useTranslation()

	const firstNameRef = useRef<HTMLInputElement>(null)
	const lastNameRef = useRef<HTMLInputElement>(null)
	const emailRef = useRef<HTMLInputElement>(null)
	const phoneRef = useRef<HTMLInputElement>(null)
	const addressRef = useRef<HTMLInputElement>(null)
	const messageRef = useRef<HTMLTextAreaElement>(null)

	const modalCtx = useContext(ModalContext)

	const inputsInWrapper = [
		{
			type: 'text',
			placeholder: t('contact.firstName'),
			id: 'first-name',
			ref: firstNameRef,
		},
		{
			type: 'text',
			placeholder: t('contact.lastName'),
			id: 'last-name',
			ref: lastNameRef,
		},
		{
			type: 'email',
			placeholder: t('contact.email'),
			id: 'email',
			ref: emailRef,
		},
		{
			type: 'tel',
			placeholder: t('contact.phone'),
			id: 'phone',
			ref: phoneRef,
		},
	]

	const inputClasses =
		'w-full rounded-2xl border border-line bg-elevated px-4 py-3.5 text-base text-text placeholder:text-muted/70 outline-none transition-colors focus:border-signal'

	const formSubmissionHandler = async (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const res = await fetch('/api/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstName: firstNameRef.current?.value,
					lastName: lastNameRef.current?.value,
					email: emailRef.current?.value,
					phone: phoneRef.current?.value,
					address: addressRef.current?.value,
					message: messageRef.current?.value,
				}),
			})
			const data: { error?: string | object; data?: string } = await res.json()

			if (res.ok && data.data) {
				modalCtx.openModal(t('contact.success'), 'success')
				firstNameRef.current!.value = ''
				lastNameRef.current!.value = ''
				emailRef.current!.value = ''
				phoneRef.current!.value = ''
				addressRef.current!.value = ''
				messageRef.current!.value = ''
				return
			}

			const errorMessage =
				typeof data.error === 'string'
					? data.error
					: 'Failed to send message. Please try again or email me directly.'
			modalCtx.openModal(errorMessage, 'error')
		} catch {
			modalCtx.openModal(
				'Failed to send message. Please try again or email me directly.',
				'error'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<section id='get-in-touch' className='scroll-mt-28 py-16 sm:py-20'>
			<div className='container max-w-3xl'>
				<h2 className='mb-8 text-center font-display text-3xl font-bold text-text'>
					{t('contact.formTitle')}
				</h2>
				<motion.form
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					onSubmit={formSubmissionHandler}
					className='flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 sm:gap-5 sm:p-10'>
					<div className='grid gap-4 sm:grid-cols-2 sm:gap-5'>
						{inputsInWrapper.map((input) => (
							<input
								key={input.id}
								type={input.type}
								placeholder={input.placeholder}
								id={input.id}
								ref={input.ref}
								className={inputClasses}
								required={input.id !== 'phone'}
							/>
						))}
					</div>
					<input
						type='text'
						placeholder={t('contact.address')}
						className={inputClasses}
						ref={addressRef}
					/>
					<textarea
						id='message'
						placeholder={t('contact.message')}
						ref={messageRef}
						required
						className={`${inputClasses} min-h-[160px] resize-y`}
					/>
					<div className='flex justify-center pt-2'>
						<Button type='submit' size='lg' disabled={isLoading}>
							{isLoading ? t('common.sending') : t('common.submit')}
						</Button>
					</div>
				</motion.form>
			</div>
		</section>
	)
}

export default ContactFormSection
