interface EmailTemplateProps {
	message: string
	address?: string
	phone?: string | number
	email: string
	firstName: string
	lastName: string
}

export const EmailTemplate = ({
	message,
	address,
	phone,
	firstName,
	lastName,
	email,
}: EmailTemplateProps): JSX.Element => (
	<div>
		<p>
			New message from {firstName} {lastName} (&lt;{email}&gt;)
		</p>
		<p>
			<strong>Message:</strong> {message}
		</p>
		{address ? (
			<p>
				<strong>Company / city:</strong> {address}
			</p>
		) : null}
		{phone ? (
			<p>
				<strong>Phone:</strong> {phone}
			</p>
		) : null}
		<p>Reply directly to this email to respond to the sender.</p>
	</div>
)

