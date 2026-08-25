'use client'

import Link from 'next/link'
import Socials from './Socials'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Footer = (): JSX.Element => {
	const { t } = useTranslation()

	return (
		<footer className='relative mt-20 border-t border-line bg-ink'>
			<div className='container max-w-6xl flex flex-col items-center gap-8 py-14 text-center'>
				<Socials />
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className='max-w-xl space-y-3 text-muted'>
					<p>{t('footer.line1')}</p>
					<p>
						{t('footer.line2')}{' '}
						<Link
							href={`mailto:${t('common.email')}`}
							className='font-medium text-signal hover:underline'>
							{t('common.email')}
						</Link>
					</p>
					<p className='pt-4 font-display text-xl font-semibold text-text'>
						{t('footer.thanks')}
					</p>
				</motion.div>
				<p className='text-xs text-muted/70'>
					© {new Date().getFullYear()} {t('common.name')}
				</p>
			</div>
		</footer>
	)
}

export default Footer
