import Image from 'next/image'
import Link from 'next/link'

const Logo = (): JSX.Element => {
	return (
		<Link href='/' className='group flex items-center gap-2'>
			<span className='relative h-9 w-9 overflow-hidden rounded-xl border border-signal/30 transition-transform group-hover:scale-105'>
				<Image
					src='/favicon-32.png'
					alt=''
					width={36}
					height={36}
					className='h-full w-full object-cover'
					priority
				/>
			</span>
			<span className='font-display text-lg font-semibold tracking-tight text-text sm:text-xl'>
				Dawid <span className='text-signal'>Krzemiński</span>
			</span>
		</Link>
	)
}

export default Logo
