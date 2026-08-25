'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { projectsMeta } from '@/lib/projects'
import Button from '../../multi-page-components/UI/Button'

const PortfolioSection = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<section className='w-full py-20 sm:py-28'>
			<div className='container max-w-6xl'>
				<div className='mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between'>
					<div>
						<p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
							{t('home.workTitle')}
						</p>
						<h2 className='max-w-xl font-display text-3xl font-bold text-text sm:text-4xl'>
							{t('home.workSubtitle')}
						</h2>
					</div>
					<Button href='/portfolio' variant='outline'>
						{t('common.viewWork')}
					</Button>
				</div>

				<div className='grid gap-8 lg:grid-cols-2'>
					{projectsMeta.map((project, index) => (
						<motion.article
							key={project.id}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className='group overflow-hidden rounded-3xl border border-line bg-surface'>
							<Link href={`/portfolio#${project.id}`} className='block'>
								<div className='relative aspect-[16/10] overflow-hidden'>
									<Image
										src={project.image}
										alt={t(`portfolio.projects.${project.id}.name`)}
										fill
										sizes='(max-width: 1024px) 100vw, 50vw'
										className='object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent' />
								</div>
								<div className='space-y-3 p-6 sm:p-8'>
									<div className='flex items-center gap-3'>
										<span
											className='h-2 w-2 rounded-full'
											style={{ backgroundColor: project.accent }}
										/>
										<h3 className='font-display text-2xl font-bold text-text'>
											{t(`portfolio.projects.${project.id}.name`)}
										</h3>
									</div>
									<p className='text-muted'>
										{t(`portfolio.projects.${project.id}.tagline`)}
									</p>
									<span className='inline-flex text-sm font-semibold text-signal transition-transform group-hover:translate-x-1'>
										{t('common.explore')} →
									</span>
								</div>
							</Link>
						</motion.article>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='mt-20 overflow-hidden rounded-[2rem] border border-line bg-elevated px-8 py-12 text-center sm:px-12'>
					<h3 className='font-display text-3xl font-bold text-text sm:text-4xl'>
						{t('home.ctaBandTitle')}
					</h3>
					<p className='mx-auto mt-4 max-w-2xl text-muted'>
						{t('home.ctaBandBody')}
					</p>
					<ul className='mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2'>
						{(
							t('home.ctaBandExamples', { returnObjects: true }) as string[]
						).map((example) => (
							<li
								key={example}
								className='rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-sand'>
								{example}
							</li>
						))}
					</ul>
					<div className='mt-8 flex justify-center'>
						<Button href='/contact' size='lg'>
							{t('home.ctaBandButton')}
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default PortfolioSection
