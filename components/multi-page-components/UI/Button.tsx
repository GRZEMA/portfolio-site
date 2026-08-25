'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'outline'
type ButtonSize = 'md' | 'lg'

interface ButtonProps {
	children: ReactNode
	href?: string
	action?: () => void
	type?: 'button' | 'submit' | 'reset'
	variant?: ButtonVariant
	size?: ButtonSize
	customClasses?: string
	disabled?: boolean
	external?: boolean
}

const sizeClasses: Record<ButtonSize, string> = {
	md: 'px-5 py-2.5 text-sm sm:text-base',
	lg: 'px-6 py-3.5 text-base sm:text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		'bg-signal text-ink font-semibold hover:bg-white hover:shadow-glow transition-all duration-300',
	ghost:
		'bg-transparent text-text border border-line hover:border-signal hover:text-signal transition-all duration-300',
	outline:
		'bg-transparent text-signal border border-signal/40 hover:bg-signal/10 transition-all duration-300',
}

const Button = ({
	children,
	href,
	action,
	type = 'button',
	variant = 'primary',
	size = 'md',
	customClasses = '',
	disabled,
	external,
}: ButtonProps): JSX.Element => {
	const classes = `inline-flex items-center justify-center gap-2 rounded-full font-sans ${sizeClasses[size]} ${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${customClasses}`

	if (href) {
		return (
			<Link
				href={href}
				className={classes}
				{...(external
					? { target: '_blank', rel: 'noopener noreferrer' }
					: {})}>
				{children}
			</Link>
		)
	}

	return (
		<button
			onClick={action}
			type={type}
			disabled={disabled}
			className={classes}>
			{children}
		</button>
	)
}

export default Button
