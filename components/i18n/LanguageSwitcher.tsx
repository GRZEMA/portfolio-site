'use client'

import { useTranslation } from 'react-i18next'
import { languages, LanguageCode } from '@/lib/i18n'

const LanguageSwitcher = (): JSX.Element => {
	const { i18n } = useTranslation()
	const current = (i18n.language?.startsWith('pl') ? 'pl' : 'en') as LanguageCode

	const setLanguage = (code: LanguageCode) => {
		i18n.changeLanguage(code)
	}

	return (
		<div
			className='inline-flex items-center rounded-full border border-line bg-surface/80 p-1 text-xs font-semibold tracking-wide'
			role='group'
			aria-label='Language'>
			{languages.map((lang) => (
				<button
					key={lang.code}
					type='button'
					onClick={() => setLanguage(lang.code)}
					className={`rounded-full px-2.5 py-1 transition-colors duration-200 ${
						current === lang.code
							? 'bg-signal text-ink'
							: 'text-muted hover:text-text'
					}`}
					aria-pressed={current === lang.code}>
					{lang.label}
				</button>
			))}
		</div>
	)
}

export default LanguageSwitcher
