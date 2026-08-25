'use client'

import DesktopNav from '@/components/multi-page-components/Navigation/DesktopNav'
import MobileNav from '@/components/multi-page-components/Navigation/MobileNav'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Navigation = (): JSX.Element => {
	const [isMobileOpen, setIsMobileOpen] = useState(false)

	return (
		<nav className='fixed top-0 z-50 w-full border-b border-line/60 bg-ink/80 text-text backdrop-blur-xl'>
			<div className='container max-w-6xl'>
				<DesktopNav openNav={() => setIsMobileOpen(true)} />
			</div>
			<AnimatePresence>
				{isMobileOpen && <MobileNav closeNav={() => setIsMobileOpen(false)} />}
			</AnimatePresence>
		</nav>
	)
}

export default Navigation
