'use client'

import Image from 'next/image'
import Button from '../UI/Button'

const HeroSection = (): JSX.Element => {
	return (
		<section className='h-screen w-full bg-background pt-20 sm:pt-24 lg:pt-0'>
			<div className='wrapper flex flex-col h-full w-full items-center xl:items-end lg:flex-row'>
				<div className='img-box relative aspect-square h-full lg:max-h-[70%] xl:max-h-[90%] bg-darkGray rounded-xl lg:rounded-l-none xl:rounded-br-none'>
					<Image
						src='/assets/image-of-me.webp'
						alt='Image of Dawid Krzemiński'
						fill
					/>
				</div>
				<div className='welcome flex flex-col mt-6 text-xl lg:text-3xl xl:text-4xl justify-around h-full items-center lg:h-4/5 lg:items-center lg:w-1/2 xl:justify-around xl:pb-12 pr-4 pl-4 xl:w-full'>
					<div className='text-box flex flex-col space-y-6 lg:space-y-10 text-center'>
						<h1>
							I&apos;M{' '}
							<span className='text-3xl lg:text-5xl font-cormorant text-customYellow'>
								Dawid Krzemiński
							</span>
						</h1>
						<p>Your Friendly Frontend Developer</p>
						<p>
							Crafting Seamless User <br />
							Experiences Through Code
						</p>
					</div>
					<Button size='2xl' href='#about'>
						Let&apos;s get acquainted!
					</Button>
				</div>
			</div>
		</section>
	)
}

export default HeroSection
