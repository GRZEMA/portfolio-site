import { Metadata } from 'next'
import { absoluteUrl, siteConfig } from '@/lib/seo'

type PageSeoInput = {
	title: string
	description: string
	path?: string
	image?: string
	/** When true, skip the root title template (use for the homepage). */
	absoluteTitle?: boolean
	noIndex?: boolean
}

export function createPageMetadata({
	title,
	description,
	path = '/',
	image = siteConfig.ogImage,
	absoluteTitle = false,
	noIndex = false,
}: PageSeoInput): Metadata {
	const url = absoluteUrl(path)
	const imageUrl = absoluteUrl(image)

	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			title,
			description,
			url,
			siteName: siteConfig.name,
			locale: siteConfig.locale,
			type: 'website',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [imageUrl],
		},
		robots: noIndex
			? { index: false, follow: false }
			: {
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
	}
}
