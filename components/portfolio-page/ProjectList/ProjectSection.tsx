'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { projectsMeta, ProjectId } from '@/lib/projects'
import Button from '@/components/multi-page-components/UI/Button'

const ProjectSection = ({ projectId }: { projectId: ProjectId }): JSX.Element => {
	const { t } = useTranslation()
	const meta = projectsMeta.find((p) => p.id === projectId)!
	const features = t(`portfolio.projects.${projectId}.features`, {
		returnObjects: true,
	}) as string[]
	const stack = t(`portfolio.projects.${projectId}.stack`, {
		returnObjects: true,
	}) as string[]

	return (
		<section id={projectId} className='scroll-mt-28 py-16 sm:py-24'>
			<div className='container max-w-6xl'>
				<div className='grid items-start gap-10 lg:grid-cols-2 lg:gap-14'>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-surface shadow-glow'>
						<Image
							src={meta.image}
							alt={t(`portfolio.projects.${projectId}.name`)}
							fill
							sizes='(max-width: 1024px) 100vw, 50vw'
							className='object-cover object-top'
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}>
						<div className='mb-3 flex items-center gap-3'>
							<span
								className='h-2.5 w-2.5 rounded-full'
								style={{ backgroundColor: meta.accent }}
							/>
							<p className='text-sm font-semibold uppercase tracking-[0.18em] text-muted'>
								{t(`portfolio.projects.${projectId}.tagline`)}
							</p>
						</div>
						<h2 className='font-display text-4xl font-bold text-text sm:text-5xl'>
							{t(`portfolio.projects.${projectId}.name`)}
						</h2>
						<p className='mt-5 text-lg leading-relaxed text-muted'>
							{t(`portfolio.projects.${projectId}.description`)}
						</p>

						<div className='mt-8'>
							<h3 className='mb-3 font-display text-lg font-semibold text-text'>
								{t('common.features')}
							</h3>
							<ul className='space-y-2.5'>
								{features.map((feature) => (
									<li
										key={feature}
										className='flex gap-3 text-muted before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-signal before:content-[""]'>
										{feature}
									</li>
								))}
							</ul>
						</div>

						<div className='mt-8'>
							<h3 className='mb-3 font-display text-lg font-semibold text-text'>
								{t('common.stack')}
							</h3>
							<div className='flex flex-wrap gap-2'>
								{stack.map((item) => (
									<span
										key={item}
										className='rounded-full border border-line bg-elevated px-3 py-1 text-sm text-sand'>
										{item}
									</span>
								))}
							</div>
						</div>

						<div className='mt-10'>
							<Button href={meta.liveUrl} external size='lg'>
								{t('common.viewLive')}
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

export default ProjectSection
