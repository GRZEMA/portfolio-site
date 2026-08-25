export type ProjectId = 'spendbeacon' | 'lekcjo'

export interface ProjectMeta {
	id: ProjectId
	liveUrl: string
	image: string
	accent: string
}

export const projectsMeta: ProjectMeta[] = [
	{
		id: 'spendbeacon',
		liveUrl: 'https://spendbeacon.app/',
		image: '/assets/projects/spendbeacon.png',
		accent: '#3DFFC8',
	},
	{
		id: 'lekcjo',
		liveUrl: 'https://lekcjo.com/',
		image: '/assets/projects/lekcjo.png',
		accent: '#FFB86B',
	},
]
