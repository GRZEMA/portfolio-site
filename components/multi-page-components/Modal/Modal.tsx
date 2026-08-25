'use client'

import { ModalContext } from '@/app/store/modal-context'
import { useContext } from 'react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import { useTranslation } from 'react-i18next'

const Modal = (): JSX.Element => {
	const modalCtx = useContext(ModalContext)
	const { t } = useTranslation()
	const isError = modalCtx.modalData.type === 'error'

	return (
		<div
			className='fixed inset-0 z-[9999] flex items-center justify-center bg-ink/80 px-4 backdrop-blur-sm'
			onClick={modalCtx.closeModal}>
			<motion.div
				initial={{ scale: 0.92, opacity: 0, y: 24 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				onClick={(e) => e.stopPropagation()}
				className='flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-line bg-surface p-8 text-center shadow-glow'>
				<h2
					className={`font-display text-2xl font-bold ${
						isError ? 'text-red-400' : 'text-signal'
					}`}>
					{isError ? 'Error' : 'Success'}
				</h2>
				<p className='text-muted'>{modalCtx.modalData.message}</p>
				<Button action={modalCtx.closeModal}>{t('common.close')}</Button>
			</motion.div>
		</div>
	)
}

export default Modal
