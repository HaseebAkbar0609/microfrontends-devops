"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";

interface UsersErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface UsersErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class UsersErrorBoundary extends Component<
  UsersErrorBoundaryProps,
  UsersErrorBoundaryState
> {
  constructor(props: UsersErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): UsersErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("UsersErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="max-w-md rounded-md border border-red-200 bg-white p-6 shadow-xs text-center">
            <h3 className="text-base font-semibold text-red-700">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              An unexpected error occurred while rendering the users section.
            </p>
            {this.state.error && (
              <p className="mt-1 text-xs text-slate-400 font-mono">
                {this.state.error.message}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={this.handleReset}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

