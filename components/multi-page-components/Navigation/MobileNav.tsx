'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

interface MobileNavProps {
	closeNav: () => void
}

const MobileNav = ({ closeNav }: MobileNavProps): JSX.Element => {
	const { t } = useTranslation()

	const links = [
		{ href: '/', label: t('nav.home') },
		{ href: '/#about', label: t('nav.about') },
		{ href: '/portfolio', label: t('nav.work') },
		{ href: '/services', label: t('nav.services') },
		{ href: '/contact', label: t('nav.contact') },
	]

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-md'>
			<div className='flex items-center justify-between px-5 py-4'>
				<span className='font-display text-lg font-semibold text-signal'>
					{t('common.name')}
				</span>
				<button
					onClick={closeNav}
					aria-label={t('nav.closeMenu')}
					className='rounded-full border border-line p-2.5 text-text'>
					<FontAwesomeIcon icon={faXmark} className='h-5 w-5' />
				</button>
			</div>
			<nav className='flex flex-1 flex-col items-center justify-center gap-6'>
				{links.map((link, index) => (
					<motion.div
						key={link.href}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05 * index }}>
						<Link
							href={link.href}
							onClick={closeNav}
							className='font-display text-3xl font-semibold text-text transition-colors hover:text-signal'>
							{link.label}
						</Link>
					</motion.div>
				))}
				<div className='pt-6'>
					<LanguageSwitcher />
				</div>
			</nav>
		</motion.div>
	)
}

export default MobileNav
