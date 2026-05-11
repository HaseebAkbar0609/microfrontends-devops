'use client'; 

import Link from 'next/link';
import { useEffect } from 'react';

const Error = ({
	error,
}: {
	error: Error & { digest?: string };
}) => {
	useEffect(() => {
		console.error('Application error:', error);
	}, [error]);

	return (
		<div className='flex h-screen flex-col items-center justify-center bg-background text-center'>
			<h1 className='mb-4 text-3xl font-bold text-accent'>500 - Internal Server Error</h1>
			<p>{error.message}</p>
			<p className='mb-6 text-lg text-secondary'>
				Oops! Something went wrong on our end. Please try again later.
			</p>
			<div className='flex gap-4'>
				
				<Link href='/' className='hover:text-primary-dark text-primary underline'>
					Go back to the Login Page
				</Link>
			</div>
		</div>
	);
};
export default Error;