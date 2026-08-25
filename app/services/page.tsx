import ServicesPageContent from '@/components/services-page/ServicesPageContent'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
	title: 'Services',
	description:
		'Product web apps, frontend craft, and full-stack delivery by Dawid Krzemiński.',
	path: '/services',
})

const ServicesPage = (): JSX.Element => {
	return <ServicesPageContent />
}

export default ServicesPage
