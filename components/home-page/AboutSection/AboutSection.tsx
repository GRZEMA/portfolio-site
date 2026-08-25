'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const AboutSection = (): JSX.Element => {
	const { t } = useTranslation()
	const skills = t('home.skills', { returnObjects: true }) as string[]
	const experience = t('home.experience', { returnObjects: true }) as {
		role: string
		company: string
		period: string
		description: string
	}[]

	return (
		<section
			id='about'
			className='relative w-full bg-mesh-section py-20 sm:py-28'>
			<div className='container max-w-6xl'>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='max-w-3xl'>
					<p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
						{t('home.aboutTitle')}
					</p>
					<h2 className='font-display text-3xl font-bold text-text sm:text-4xl lg:text-5xl'>
						{t('home.aboutLead')}
					</h2>
					<p className='mt-6 text-lg leading-relaxed text-muted'>
						{t('home.aboutBody')}
					</p>
					<p className='mt-4 text-sm font-medium text-sand'>
						{t('home.location')}
					</p>
				</motion.div>

				<div className='mt-16'>
					<h3 className='mb-6 font-display text-xl font-semibold text-text'>
						{t('home.skillsTitle')}
					</h3>
					<ul className='flex flex-wrap gap-2.5'>
						{skills.map((skill, index) => (
							<motion.li
								key={skill}
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.03 }}
								className='rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-signal/50 hover:text-signal'>
								{skill}
							</motion.li>
						))}
					</ul>
				</div>

				<div className='mt-20'>
					<h3 className='mb-8 font-display text-xl font-semibold text-text'>
						{t('home.experienceTitle')}
					</h3>
					<div className='space-y-0 border-l border-line pl-6 sm:pl-8'>
						{experience.map((item, index) => (
							<motion.article
								key={`${item.company}-${item.role}`}
								initial={{ opacity: 0, x: -16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.08 }}
								className='relative pb-10 last:pb-0'>
								<span className='absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-signal bg-ink sm:-left-[2.15rem]' />
								<div className='flex flex-wrap items-baseline justify-between gap-2'>
									<h4 className='font-display text-lg font-semibold text-text'>
										{item.role}{' '}
										<span className='text-signal'>@ {item.company}</span>
									</h4>
									<span className='text-sm text-muted'>{item.period}</span>
								</div>
								<p className='mt-2 max-w-2xl text-muted'>{item.description}</p>
							</motion.article>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default AboutSection
