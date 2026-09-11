import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-screen flex-col items-center justify-center bg-background text-center">
			<h1 className="mb-4 text-3xl font-bold text-accent">404 - Page Not Found</h1>
			<p className="mb-6 text-lg text-secondary">
				The page you are looking for does not exist.
			</p>
			<div className="flex gap-4">
				<Link href="/" className="hover:text-primary-dark text-primary underline">
					Go back to Home
				</Link>
			</div>
		</div>
	);
}
