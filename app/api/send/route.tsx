import { EmailTemplate } from '@/components/email-template/email-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const POST = async (req: Request) => {
	const body = await req.json()
	const { firstName, lastName, email, phone, address, message } = body

	if (!firstName || !lastName || !email || !message) {
		return NextResponse.json({ error: 'Please fill in all required fields' })
	}

	if (!process.env.RESEND_API_KEY) {
		return NextResponse.json({ error: 'Email service is not configured' })
	}

	const resend = new Resend(process.env.RESEND_API_KEY)

	try {
		await resend.emails.send({
			from: `${firstName} ${lastName} <dawid@dawidkrzeminski.tech>`,
			to: ['dawidkrzmnsk@gmail.com'],
			subject: `${firstName} ${lastName} has sent you a message through your contact form!`,
			react: EmailTemplate({
				firstName,
				lastName,
				phone: phone ? phone : undefined,
				address: address ? address : undefined,
				message,
				email,
			}),
		})
		return NextResponse.json({ data: 'Your mail was successfully sent!' })
	} catch (error) {
		return NextResponse.json({ error })
	}
}
