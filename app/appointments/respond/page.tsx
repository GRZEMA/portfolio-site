import { redirect } from 'next/navigation'
import RespondView from '@/components/appointments/RespondView'
import { getDecision } from '@/lib/appointments/decisions'
import { verifyAppointment } from '@/lib/appointments/token'

export const dynamic = 'force-dynamic'

const RespondPage = async ({
	searchParams,
}: {
	searchParams: { token?: string; action?: string }
}): Promise<JSX.Element> => {
	const token = searchParams.token ?? ''
	const verified = verifyAppointment(token)
	if (!verified.ok) return <RespondView status={verified.reason} />

	const decision = await getDecision(verified.appointment.id)
	if (decision) {
		redirect(
			`/appointments/respond/done?result=${
				decision === 'accepted' ? 'already-accepted' : 'already-rejected'
			}`
		)
	}

	const action =
		searchParams.action === 'accept' || searchParams.action === 'reject'
			? searchParams.action
			: 'choose'

	const { name, email, topic, message, start, end, timeZone, durationMinutes } =
		verified.appointment

	return (
		<RespondView
			status='ready'
			action={action}
			token={token}
			appointment={{ name, email, topic, message, start, end, timeZone, durationMinutes }}
		/>
	)
}

export default RespondPage
