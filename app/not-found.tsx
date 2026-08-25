'use client'

import Button from '@/components/multi-page-components/UI/Button'
import { useTranslation } from 'react-i18next'

const Error = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<main className='flex min-h-screen items-center justify-center bg-mesh-hero px-6'>
			<section className='max-w-lg text-center'>
				<p className='mb-4 font-display text-8xl font-extrabold text-signal/30'>
					404
				</p>
				<h1 className='font-display text-3xl font-bold text-text sm:text-4xl'>
					{t('notFound.title')}
				</h1>
				<p className='mt-4 text-muted'>{t('notFound.body')}</p>
				<div className='mt-8 flex justify-center'>
					<Button href='/' size='lg'>
						{t('common.backHome')}
					</Button>
				</div>
			</section>
		</main>
	)
}

export default Error
