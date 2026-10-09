import AppointmentPage from '@/components/appointments/AppointmentPage'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
	title: 'Book a time',
	description:
		'Request an evening or weekend appointment with Dawid Krzemiński. Confirmed times are added to Google Calendar.',
	path: '/appointments',
})

const Page = (): JSX.Element => {
	return <AppointmentPage />
}

export default Page
