'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ProjectSection from '@/components/portfolio-page/ProjectList/ProjectSection'
import Button from '@/components/multi-page-components/UI/Button'
import { projectsMeta } from '@/lib/projects'

const PortfolioPageContent = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<main className='text-text'>
			<section className='relative overflow-hidden bg-mesh-hero pb-16 pt-32 sm:pb-20 sm:pt-40'>
				<div className='container relative z-10 max-w-6xl'>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}>
						<p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-signal'>
							{t('portfolio.title')}
						</p>
						<h1 className='max-w-3xl font-display text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl'>
							{t('portfolio.subtitle')}
						</h1>
					</motion.div>
				</div>
			</section>

			{projectsMeta.map((project) => (
				<ProjectSection key={project.id} projectId={project.id} />
			))}

			<section className='pb-20 pt-8'>
				<div className='container max-w-6xl'>
					<div className='rounded-[2rem] border border-line bg-elevated px-8 py-12 text-center sm:px-12'>
						<h2 className='font-display text-3xl font-bold text-text sm:text-4xl'>
							{t('portfolio.ctaTitle')}
						</h2>
						<p className='mx-auto mt-4 max-w-xl text-muted'>
							{t('portfolio.ctaBody')}
						</p>
						<div className='mt-8 flex justify-center'>
							<Button href='/contact' size='lg'>
								{t('common.getInTouch')}
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default PortfolioPageContent
