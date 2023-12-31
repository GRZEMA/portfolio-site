'use client'

import ContactFormSection from '@/components/contact-page/ContactFormSection/ContactFormSection'
import FindMeThereSection from '@/components/contact-page/FindMeThereSection/FindMeThereSection'
import HeroSection from '@/components/multi-page-components/HeroSection/HeroSection'
import Modal from '@/components/multi-page-components/Modal/Modal'
import { useContext } from 'react'
import { ModalContext } from '../store/modal-context'

const ContactPage = () => {
	const modalCtx = useContext(ModalContext)
	return (
		<>
			{modalCtx.modalOpen && <Modal />}
			<main className='pb-5 bg-background lg:pb-10 text-text'>
				<HeroSection
					linkId='get-in-touch'
					title='Contact Me'
					imageUrl='/assets/contactBg.png'
				/>
				<ContactFormSection />
				<FindMeThereSection />
			</main>
		</>
	)
}

export default ContactPage
