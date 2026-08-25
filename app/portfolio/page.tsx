import PortfolioPageContent from '@/components/portfolio-page/PortfolioPageContent'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
	title: 'Work',
	description:
		'SpendBeacon and Lekcjo — live products built by Dawid Krzemiński.',
	path: '/portfolio',
	image: '/assets/projects/spendbeacon.png',
})

const PortfolioPage = (): JSX.Element => {
	return <PortfolioPageContent />
}

export default PortfolioPage
