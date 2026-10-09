import DoneView from '@/components/appointments/DoneView'
import { isAppointmentResult } from '@/lib/appointments/results'

export const dynamic = 'force-dynamic'

const DonePage = ({
	searchParams,
}: {
	searchParams: { result?: string }
}): JSX.Element => {
	const result =
		searchParams.result && isAppointmentResult(searchParams.result)
			? searchParams.result
			: 'error'
	return <DoneView result={result} />
}

export default DonePage
