import AboutSection from '@/components/home-page/AboutSection/AboutSection'
import WelcomeSection from '@/components/home-page/WelcomeSection/WelcomeSection'
import PortfolioSection from '@/components/home-page/PortfolioSection/PortfolioSection'
import { createPageMetadata } from '@/lib/metadata'
import { siteConfig } from '@/lib/seo'

export const metadata = createPageMetadata({
	title: siteConfig.title,
	description: siteConfig.description,
	path: '/',
	absoluteTitle: true,
})

export default function Home() {
	return (
		<main className='flex flex-col items-center text-text'>
			<WelcomeSection />
			<AboutSection />
			<PortfolioSection />
		</main>
	)
}
