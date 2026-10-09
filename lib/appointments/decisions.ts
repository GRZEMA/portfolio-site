import { promises as fs } from 'fs'
import path from 'path'
import {
	decisionFromEvent,
	getCalendarEvent,
	isCalendarConfigured,
	type CalendarDecision,
} from '@/lib/appointments/google-calendar'

const memory = new Map<string, CalendarDecision>()
const filePath = path.join(process.cwd(), 'data', 'appointment-decisions.json')

async function readFileStore(): Promise<Record<string, CalendarDecision>> {
	try {
		const raw = await fs.readFile(filePath, 'utf8')
		const parsed: unknown = JSON.parse(raw)
		if (!parsed || typeof parsed !== 'object') return {}
		return parsed as Record<string, CalendarDecision>
	} catch {
		return {}
	}
}

async function writeFileStore(data: Record<string, CalendarDecision>) {
	try {
		await fs.mkdir(path.dirname(filePath), { recursive: true })
		await fs.writeFile(filePath, JSON.stringify(data, null, 2))
	} catch (error) {
		console.error('Could not persist appointment decision to disk', error)
	}
}

export async function getDecision(id: string): Promise<CalendarDecision | null> {
	if (isCalendarConfigured()) {
		try {
			const event = await getCalendarEvent(id)
			const decision = decisionFromEvent(event)
			if (decision) {
				memory.set(id, decision)
				return decision
			}
		} catch (error) {
			console.error('Calendar decision lookup failed', error)
		}
	}

	const cached = memory.get(id)
	if (cached) return cached

	const stored = (await readFileStore())[id]
	if (stored === 'accepted' || stored === 'rejected') {
		memory.set(id, stored)
		return stored
	}
	return null
}

export async function saveDecision(id: string, decision: CalendarDecision) {
	memory.set(id, decision)
	const stored = await readFileStore()
	stored[id] = decision
	await writeFileStore(stored)
}
