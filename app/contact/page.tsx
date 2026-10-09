'use client'

import ContactFormSection from '@/components/contact-page/ContactFormSection/ContactFormSection'
import FindMeThereSection from '@/components/contact-page/FindMeThereSection/FindMeThereSection'
import Modal from '@/components/multi-page-components/Modal/Modal'
import { useContext } from 'react'
import { ModalContext } from '../store/modal-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const ContactPage = () => {
	const modalCtx = useContext(ModalContext)
	const { t } = useTranslation()

	return (
		<>
			{modalCtx.modalOpen && <Modal />}
			<main className='text-text'>
				<section className='relative overflow-hidden bg-mesh-hero pb-12 pt-32 sm:pb-16 sm:pt-40'>
					<div className='container relative z-10 max-w-6xl'>
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}>
							<p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
								{t('contact.title')}
							</p>
							<h1 className='max-w-3xl font-display text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl'>
								{t('contact.subtitle')}
							</h1>
							<p className='mt-6 max-w-2xl text-lg text-muted'>
								{t('contact.bookPrompt')}{' '}
								<Link href='/appointments' className='font-medium text-signal hover:underline'>
									{t('contact.bookLink')}
								</Link>
							</p>
						</motion.div>
					</div>
				</section>
				<ContactFormSection />
				<FindMeThereSection />
			</main>
		</>
	)
}

export default ContactPage
