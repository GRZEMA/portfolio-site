'use client'

import {
	faGithub,
	faLinkedin,
	faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Link from 'next/link'

const socials = [
	{
		href: 'mailto:dawidkrzmnsk@gmail.com',
		icon: faEnvelope,
		label: 'Email',
	},
	{
		href: 'https://www.linkedin.com/in/dawid-krzeminski/',
		icon: faLinkedin,
		label: 'LinkedIn',
	},
	{
		href: 'https://github.com/GRZEMA',
		icon: faGithub,
		label: 'GitHub',
	},
	{
		href: 'https://wa.link/wb9y7h',
		icon: faWhatsapp,
		label: 'WhatsApp',
	},
]

const Socials = (): JSX.Element => {
	return (
		<div className='flex items-center justify-center gap-4'>
			{socials.map((social, index) => (
				<motion.div
					key={social.href}
					initial={{ y: 20, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ delay: index * 0.05 }}
					viewport={{ once: true }}>
					<Link
						href={social.href}
						target={social.href.startsWith('http') ? '_blank' : undefined}
						rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
						aria-label={social.label}
						className='flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:border-signal hover:text-signal'>
						<FontAwesomeIcon icon={social.icon} className='text-lg' />
					</Link>
				</motion.div>
			))}
		</div>
	)
}

export default Socials
