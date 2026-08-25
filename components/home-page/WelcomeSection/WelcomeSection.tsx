'use client'

import Image from 'next/image'
import Button from '../../multi-page-components/UI/Button'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const WelcomeSection = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<section className='relative flex min-h-screen w-full items-end overflow-hidden pt-24 sm:items-center'>
			<div className='absolute inset-0'>
				<Image
					src='/assets/image-of-me.webp'
					alt={t('common.name')}
					fill
					priority
					sizes='100vw'
					className='object-cover object-[center_20%]'
				/>
				<div className='absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40' />
				<div className='absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50' />
				<div className='absolute inset-0 bg-[linear-gradient(to_right,rgba(36,48,68,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(36,48,68,0.25)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_50%,black,transparent)]' />
			</div>

			<div className='container relative z-10 mx-auto max-w-6xl pb-16 pt-10 sm:pb-24'>
				<motion.div
					initial={{ opacity: 0, y: 36 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.75 }}
					className='max-w-2xl'>
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 }}
						className='mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-signal'>
						{t('home.role')}
					</motion.p>
					<h1 className='font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-text sm:text-6xl md:text-7xl lg:text-8xl'>
						{t('common.name')}
					</h1>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.25 }}
						className='mt-6 max-w-lg text-lg leading-relaxed text-text/80 sm:text-xl'>
						{t('home.tagline')}
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35 }}
						className='mt-10 flex flex-wrap gap-3'>
						<Button href='/portfolio' size='lg'>
							{t('home.ctaPrimary')}
						</Button>
						<Button href='/contact' variant='ghost' size='lg'>
							{t('home.ctaSecondary')}
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

export default WelcomeSection
