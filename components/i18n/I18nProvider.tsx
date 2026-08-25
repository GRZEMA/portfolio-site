'use client'

import { ReactNode, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { resolvePreferredLanguage } from '@/lib/i18n'

export default function I18nProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		const preferred = resolvePreferredLanguage()
		if (i18n.language !== preferred) {
			void i18n.changeLanguage(preferred)
		}

		const syncLang = (lng?: string) => {
			const code = lng?.startsWith('pl') ? 'pl' : 'en'
			document.documentElement.lang = code
			window.localStorage.setItem('portfolio-lang', code)
		}

		syncLang(i18n.language)
		i18n.on('languageChanged', syncLang)
		return () => {
			i18n.off('languageChanged', syncLang)
		}
	}, [])

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
