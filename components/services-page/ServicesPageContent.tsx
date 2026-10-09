'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Button from '@/components/multi-page-components/UI/Button'

const ServicesPageContent = (): JSX.Element => {
	const { t } = useTranslation()
	const offers = t('services.offers', { returnObjects: true }) as {
		title: string
		description: string
	}[]
	const whyItems = t('services.whyItems', { returnObjects: true }) as string[]

	return (
		<main className='text-text'>
			<section className='relative overflow-hidden bg-mesh-hero pb-16 pt-32 sm:pb-20 sm:pt-40'>
				<div className='container relative z-10 max-w-6xl'>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}>
						<p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
							{t('services.title')}
						</p>
						<h1 className='max-w-3xl font-display text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl'>
							{t('services.subtitle')}
						</h1>
					</motion.div>
				</div>
			</section>

			<section className='py-16 sm:py-24'>
				<div className='container max-w-6xl'>
					<h2 className='mb-10 font-display text-3xl font-bold text-text'>
						{t('services.offerTitle')}
					</h2>
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{offers.map((offer, index) => (
							<motion.article
								key={offer.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05 }}
								className='rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-signal/40 sm:p-8'>
								<span className='mb-4 block font-display text-sm font-bold text-signal'>
									{String(index + 1).padStart(2, '0')}
								</span>
								<h3 className='font-display text-xl font-semibold text-text'>
									{offer.title}
								</h3>
								<p className='mt-3 leading-relaxed text-muted'>
									{offer.description}
								</p>
							</motion.article>
						))}
					</div>
				</div>
			</section>

			<section className='bg-mesh-section py-16 sm:py-24'>
				<div className='container max-w-6xl'>
					<h2 className='mb-10 font-display text-3xl font-bold text-text'>
						{t('services.whyTitle')}
					</h2>
					<ul className='grid gap-4 md:grid-cols-2'>
						{whyItems.map((item, index) => (
							<motion.li
								key={item}
								initial={{ opacity: 0, x: -12 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.04 }}
								className='flex gap-4 rounded-2xl border border-line bg-surface/60 px-5 py-4 text-muted'>
								<span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-signal' />
								{item}
							</motion.li>
						))}
					</ul>
				</div>
			</section>

			<section className='pb-20 pt-8'>
				<div className='container max-w-6xl'>
					<div className='rounded-[2rem] border border-line bg-elevated px-8 py-12 text-center sm:px-12'>
						<h2 className='font-display text-3xl font-bold text-text sm:text-4xl'>
							{t('services.ctaTitle')}
						</h2>
						<p className='mx-auto mt-4 max-w-xl text-muted'>
							{t('services.ctaBody')}
						</p>
						<div className='mt-8 flex flex-wrap justify-center gap-3'>
							<Button href='/contact' size='lg'>
								{t('services.ctaButton')}
							</Button>
							<Button href='/appointments' variant='ghost' size='lg'>
								{t('services.ctaBook')}
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default ServicesPageContent
