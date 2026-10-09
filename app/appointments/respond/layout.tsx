import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
	title: 'Review appointment',
	description: 'Confirm or decline an appointment request.',
	path: '/appointments/respond',
	noIndex: true,
})

export default function RespondLayout({ children }: { children: React.ReactNode }) {
	return children
}
