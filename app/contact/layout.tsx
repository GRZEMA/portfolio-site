import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
	title: 'Contact',
	description:
		'Get in touch with Dawid Krzemiński about your next product or collaboration.',
	path: '/contact',
})

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
