export function siteUrlFrom(req: Request): string {
	const origin = new URL(req.url).origin
	if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
	const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
	return configured || origin
}
