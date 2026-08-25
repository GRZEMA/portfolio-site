import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1.25rem',
				sm: '1.5rem',
				lg: '2rem',
			},
		},
		extend: {
			fontFamily: {
				display: ['var(--font-syne)'],
				sans: ['var(--font-jakarta)'],
			},
			colors: {
				ink: '#070B14',
				surface: '#0F1522',
				elevated: '#161E2E',
				signal: '#3DFFC8',
				signalDim: '#1FB894',
				sand: '#E6D5B8',
				text: '#E8EDF5',
				muted: '#8B95A8',
				line: '#243044',
			},
			backgroundImage: {
				'mesh-hero':
					'radial-gradient(ellipse 80% 60% at 70% 10%, rgba(61,255,200,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(230,213,184,0.08), transparent 50%), linear-gradient(180deg, #070B14 0%, #0A1020 50%, #070B14 100%)',
				'mesh-section':
					'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(61,255,200,0.06), transparent 60%)',
			},
			boxShadow: {
				glow: '0 0 60px rgba(61,255,200,0.12)',
			},
			keyframes: {
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},
			},
			animation: {
				'fade-up': 'fade-up 0.7s ease-out forwards',
				float: 'float 6s ease-in-out infinite',
			},
		},
	},
	plugins: [],
}
export default config
