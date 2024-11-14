import React, { Component, ReactNode } from "react";

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<any, ErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        // Update state to trigger the fallback UI on the next render
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error("Error caught by ErrorBoundary: ", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
                    <img src="/assets/png/error.png" alt="Error" className="w-48 mb-6" />
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Oops! Something went wrong.</h1>
                    <p className="text-lg text-gray-600 mb-2">
                        We’re sorry for the inconvenience. Our team has been notified.
                    </p>
                    <p className="text-md text-gray-500 mb-8">
                        Please try refreshing the page, or come back later.
                    </p>
                  
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
