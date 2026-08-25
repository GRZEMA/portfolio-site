'use client'

import Socials from '@/components/multi-page-components/Footer/Socials'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const FindMeThereSection = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<section className='pb-20'>
			<div className='container max-w-3xl text-center'>
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='rounded-3xl border border-line bg-elevated px-6 py-12 sm:px-10'>
					<h2 className='font-display text-2xl font-bold text-text sm:text-3xl'>
						{t('contact.findTitle')}
					</h2>
					<p className='mx-auto mt-3 max-w-md text-muted'>
						{t('contact.findBody')}
					</p>
					<p className='mt-6'>
						<Link
							href={`mailto:${t('common.email')}`}
							className='font-medium text-signal hover:underline'>
							{t('common.email')}
						</Link>
					</p>
					<div className='mt-8'>
						<Socials />
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default FindMeThereSection
