/**
 * One-time Google Calendar connection.
 *
 * 1. In Google Cloud, enable the Google Calendar API.
 * 2. Create an OAuth client (Web application).
 * 3. Add this redirect URI: http://127.0.0.1:42813/callback
 * 4. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 * 5. Run: npm run calendar:auth
 * 6. Sign in with the Google account that owns the calendar.
 */
import { exec } from 'child_process'
import fs from 'fs'
import http from 'http'
import path from 'path'

function loadEnvLocal() {
	const file = path.join(process.cwd(), '.env.local')
	if (!fs.existsSync(file)) return
	for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		let value = trimmed.slice(eq + 1).trim()
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1)
		}
		if (!process.env[key]) process.env[key] = value
	}
}

loadEnvLocal()

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const port = 42813
const redirectUri = `http://127.0.0.1:${port}/callback`
const scope = 'https://www.googleapis.com/auth/calendar.events'

if (!clientId || !clientSecret) {
	console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.')
	console.error(`Authorized redirect URI: ${redirectUri}`)
	process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('redirect_uri', redirectUri)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', scope)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`)
	if (url.pathname !== '/callback') {
		res.writeHead(404)
		res.end('Not found')
		return
	}

	const code = url.searchParams.get('code')
	const oauthError = url.searchParams.get('error')
	if (oauthError || !code) {
		res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
		res.end(`<p>Authorization failed: ${oauthError || 'missing code'}</p>`)
		server.close()
		process.exit(1)
	}

	const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		}),
	})
	const tokens = await tokenResponse.json()
	if (!tokenResponse.ok) {
		res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
		res.end('<p>Token exchange failed. Check the terminal.</p>')
		console.error(tokens)
		server.close()
		process.exit(1)
	}

	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
	res.end('<p>Google Calendar is connected. You can close this tab and return to the terminal.</p>')
	console.log('\nAdd this to .env.local and to your host’s environment:\n')
	if (tokens.refresh_token) {
		console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
	} else {
		console.log('Google did not return a refresh token.')
		console.log('Remove the app at https://myaccount.google.com/permissions and run this again.')
	}
	server.close()
	process.exit(0)
})

server.listen(port, '127.0.0.1', () => {
	const url = authUrl.toString()
	console.log('Sign in with the Google account that owns your calendar:\n')
	console.log(url)
	console.log('\nWaiting for Google to redirect back...')
	if (process.platform === 'win32') {
		exec(`start "" "${url}"`)
	}
})

setTimeout(() => {
	console.error('Timed out waiting for Google. Run the command again when you are ready.')
	server.close()
	process.exit(1)
}, 5 * 60 * 1000).unref()
