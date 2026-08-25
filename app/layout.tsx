import './globals.css'
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'
import Navigation from './Navigation'
import Footer from '@/components/multi-page-components/Footer/Footer'
import NextTopLoader from 'nextjs-toploader'
import { Metadata } from 'next'
import ModalContextProvider from './store/modal-context'
import { Analytics } from '@vercel/analytics/react'
import I18nProvider from '@/components/i18n/I18nProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { siteConfig } from '@/lib/seo'

const syne = Syne({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	weight: ['500', '600', '700', '800'],
	variable: '--font-syne',
})

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-jakarta',
})

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	authors: [{ name: siteConfig.name, url: siteConfig.url }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	keywords: [...siteConfig.keywords],
	category: 'technology',
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon.ico', sizes: 'any' },
			{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
	},
	manifest: '/site.webmanifest',
	openGraph: {
		title: siteConfig.title,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		locale: siteConfig.locale,
		type: 'website',
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.title,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
		: undefined,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={`${syne.variable} ${jakarta.variable} scroll-smooth`}>
			<body className='min-h-screen bg-ink text-text'>
				<JsonLd />
				<I18nProvider>
					<ModalContextProvider>
						<Navigation />
						<NextTopLoader color='#3DFFC8' showSpinner={false} />
						{children}
						<Footer />
						<Analytics />
					</ModalContextProvider>
				</I18nProvider>
			</body>
		</html>
	)
}
