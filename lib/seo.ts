export const siteConfig = {
	name: 'Dawid Krzemiński',
	title: 'Dawid Krzemiński | Full-stack Developer',
	description:
		'Consultant at Awumba and builder of SpendBeacon & Lekcjo. Full-stack developer focused on React, Next.js, and product SaaS.',
	url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dawidkrzeminski.tech',
	locale: 'en_US',
	ogImage: '/assets/projects/spendbeacon.png',
	email: 'dawidkrzmnsk@gmail.com',
	linkedin: 'https://www.linkedin.com/in/dawid-krzeminski/',
	github: 'https://github.com/GRZEMA',
	keywords: [
		'Dawid Krzemiński',
		'Full-stack Developer',
		'Frontend Developer',
		'React',
		'Next.js',
		'TypeScript',
		'.NET',
		'FastAPI',
		'SpendBeacon',
		'Lekcjo',
		'Awumba',
		'Portfolio',
		'Poznań',
		'Poland',
	],
} as const

export const absoluteUrl = (path = '/') => {
	const base = siteConfig.url.replace(/\/$/, '')
	const normalized = path.startsWith('/') ? path : `/${path}`
	return `${base}${normalized === '/' ? '' : normalized}` || base
}

export const routes = [
	{
		path: '/',
		title: siteConfig.title,
		description: siteConfig.description,
		changeFrequency: 'weekly' as const,
		priority: 1,
	},
	{
		path: '/portfolio',
		title: 'Work | Dawid Krzemiński',
		description:
			'SpendBeacon and Lekcjo — live products built by Dawid Krzemiński.',
		changeFrequency: 'weekly' as const,
		priority: 0.9,
	},
	{
		path: '/services',
		title: 'Services | Dawid Krzemiński',
		description:
			'Product web apps, frontend craft, and full-stack delivery by Dawid Krzemiński.',
		changeFrequency: 'monthly' as const,
		priority: 0.8,
	},
	{
		path: '/contact',
		title: 'Contact | Dawid Krzemiński',
		description:
			'Get in touch with Dawid Krzemiński about your next product or collaboration.',
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	},
] as const
