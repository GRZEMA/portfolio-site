import { absoluteUrl, siteConfig } from '@/lib/seo'

export function JsonLd() {
	const person = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: siteConfig.name,
		url: siteConfig.url,
		image: absoluteUrl('/assets/image-of-me.webp'),
		email: siteConfig.email,
		jobTitle: 'Full-stack Developer',
		worksFor: {
			'@type': 'Organization',
			name: 'Awumba',
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Poznań',
			addressCountry: 'PL',
		},
		sameAs: [siteConfig.linkedin, siteConfig.github],
		knowsAbout: [
			'React',
			'Next.js',
			'TypeScript',
			'.NET',
			'FastAPI',
			'PostgreSQL',
			'SaaS',
		],
	}

	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `${siteConfig.name} Portfolio`,
		url: siteConfig.url,
		description: siteConfig.description,
		inLanguage: ['en', 'pl'],
		author: {
			'@type': 'Person',
			name: siteConfig.name,
		},
	}

	const portfolio = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Selected work',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				item: {
					'@type': 'SoftwareApplication',
					name: 'SpendBeacon',
					url: 'https://spendbeacon.app/',
					applicationCategory: 'FinanceApplication',
					description:
						'Personal finance SaaS with bank CSV import, budgets, and AI categorization.',
				},
			},
			{
				'@type': 'ListItem',
				position: 2,
				item: {
					'@type': 'SoftwareApplication',
					name: 'Lekcjo',
					url: 'https://lekcjo.com/',
					applicationCategory: 'EducationalApplication',
					description:
						'Scheduling, notes, and online lessons for tutors and students.',
				},
			},
		],
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolio) }}
			/>
		</>
	)
}
