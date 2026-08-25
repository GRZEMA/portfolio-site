'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import pl from '@/locales/pl.json'

export const languages = [
	{ code: 'en', label: 'EN' },
	{ code: 'pl', label: 'PL' },
] as const

export type LanguageCode = (typeof languages)[number]['code']

const resources = {
	en: { translation: en },
	pl: { translation: pl },
}

if (!i18n.isInitialized) {
	// Always boot in English so SSR and the first client render match.
	// Preferred language is applied after mount in I18nProvider.
	i18n.use(initReactI18next).init({
		resources,
		lng: 'en',
		fallbackLng: 'en',
		supportedLngs: ['en', 'pl'],
		interpolation: { escapeValue: false },
	})
}

export function resolvePreferredLanguage(): LanguageCode {
	if (typeof window === 'undefined') return 'en'

	const stored = window.localStorage.getItem('portfolio-lang')
	if (stored === 'pl' || stored === 'en') return stored

	// Migrate from older i18next detector key if present
	const legacy = window.localStorage.getItem('i18nextLng')?.toLowerCase() ?? ''
	if (legacy.startsWith('pl')) return 'pl'
	if (legacy.startsWith('en')) return 'en'

	const browser = window.navigator.language?.toLowerCase() ?? ''
	return browser.startsWith('pl') ? 'pl' : 'en'
}

export default i18n
