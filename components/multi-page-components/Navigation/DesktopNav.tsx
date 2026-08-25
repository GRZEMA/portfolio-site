'use client'

import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Logo from '../Logo/Logo'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

interface DesktopNavProps {
	openNav: () => void
}

const DesktopNav = ({ openNav }: DesktopNavProps): JSX.Element => {
	const pathname = usePathname()
	const { t } = useTranslation()

	const links = [
		{ href: '/', label: t('nav.home') },
		{ href: '/#about', label: t('nav.about') },
		{ href: '/portfolio', label: t('nav.work') },
		{ href: '/services', label: t('nav.services') },
		{ href: '/contact', label: t('nav.contact') },
	]

	const isActive = (href: string) => {
		if (href === '/') return pathname === '/'
		if (href.startsWith('/#')) return false
		return pathname === href
	}

	return (
		<div className='flex w-full items-center justify-between gap-4 py-4'>
			<Logo />
			<ul className='hidden items-center gap-1 md:flex lg:gap-2'>
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 lg:px-4 ${
								isActive(link.href)
									? 'text-signal'
									: 'text-muted hover:text-text'
							}`}>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
			<div className='flex items-center gap-3'>
				<div className='hidden sm:block'>
					<LanguageSwitcher />
				</div>
				<button
					className='rounded-full border border-line p-2.5 text-signal md:hidden'
					onClick={openNav}
					aria-label={t('nav.openMenu')}>
					<FontAwesomeIcon icon={faBars} className='h-5 w-5' />
				</button>
			</div>
		</div>
	)
}

export default DesktopNav
