import { EmailTemplate } from '@/components/email-template/email-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const FROM_EMAIL =
	process.env.RESEND_FROM_EMAIL ?? 'Portfolio <noreply@dawidkrzeminski.com>'
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'dawidkrzmnsk@gmail.com'

export const POST = async (req: Request) => {
	try {
		const body = await req.json()
		const { firstName, lastName, email, phone, address, message } = body

		if (!firstName || !lastName || !email || !message) {
			return NextResponse.json(
				{ error: 'Please fill in all required fields' },
				{ status: 400 }
			)
		}

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json(
				{ error: 'Email service is not configured' },
				{ status: 500 }
			)
		}

		const resend = new Resend(process.env.RESEND_API_KEY)

		const { data, error } = await resend.emails.send({
			from: FROM_EMAIL,
			to: [TO_EMAIL],
			reply_to: email,
			subject: `Portfolio contact: ${firstName} ${lastName}`,
			react: EmailTemplate({
				firstName,
				lastName,
				phone: phone ? phone : undefined,
				address: address ? address : undefined,
				message,
				email,
			}),
		})

		if (error) {
			console.error('Resend error:', error)
			return NextResponse.json(
				{
					error:
						typeof error === 'object' && error && 'message' in error
							? String((error as { message: string }).message)
							: 'Failed to send email. Check Resend domain verification.',
				},
				{ status: 502 }
			)
		}

		return NextResponse.json({ data: 'Your mail was successfully sent!', id: data?.id })
	} catch (error) {
		console.error('Contact API error:', error)
		return NextResponse.json(
			{ error: 'Unexpected error while sending email' },
			{ status: 500 }
		)
	}
}
