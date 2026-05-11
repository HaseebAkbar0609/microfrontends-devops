'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '../ui/button';


/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle React component errors gracefully
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	/**
	 * Update state when an error is caught
	 */
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	/**
	 * Log error information when an error is caught
	 */
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.error('Error caught by boundary:', error, errorInfo);
		
		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	/**
	 * Reset error state
	 */
	handleReset = (): void => {
		this.setState({ hasError: false, error: null });
	};

	/**
	 * Render error UI or children
	 */
	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
					<h1 className="mb-4 text-3xl font-bold text-accent">
						Something went wrong
					</h1>
					<p className="mb-4 text-lg text-secondary">
						{this.state.error?.message || 'An unexpected error occurred'}
					</p>
					<Button
						onClick={this.handleReset}
						className="bg-primary text-white"
					>
						Try again
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

