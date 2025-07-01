import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null
    };
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
        // Log error to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send error to monitoring service (e.g., Sentry, LogRocket)
            console.error('Production error logged:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack
            });
        }
    }
    handleRefresh = () => {
        window.location.reload();
    };
    handleGoHome = () => {
        window.location.href = '/';
    };
    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };
    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default error UI
            return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: _jsx("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertTriangle, { className: "mx-auto h-12 w-12 text-red-500 mb-4" }), _jsx("h2", { className: "text-lg font-medium text-gray-900 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-gray-600 mb-6", children: "We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page." }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: this.handleRetry, className: "w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Try Again"] }), _jsxs("button", { onClick: this.handleRefresh, className: "w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh Page"] }), _jsxs("button", { onClick: this.handleGoHome, className: "w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: [_jsx(Home, { className: "h-4 w-4 mr-2" }), "Go to Home"] })] }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("details", { className: "mt-6 text-left", children: [_jsx("summary", { className: "text-sm text-gray-500 cursor-pointer hover:text-gray-700 mb-2", children: "Error Details (Development Only)" }), _jsxs("div", { className: "bg-gray-100 p-3 rounded text-xs", children: [_jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Error:" }), " ", this.state.error.message] }), this.state.error.stack && (_jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Stack:" }), _jsx("pre", { className: "whitespace-pre-wrap text-xs mt-1", children: this.state.error.stack })] })), this.state.errorInfo?.componentStack && (_jsxs("div", { children: [_jsx("strong", { children: "Component Stack:" }), _jsx("pre", { className: "whitespace-pre-wrap text-xs mt-1", children: this.state.errorInfo.componentStack })] }))] })] }))] }) }) }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
// Higher-order component for easier usage
export const withErrorBoundary = (Component, fallback) => {
    const WrappedComponent = (props) => (_jsx(ErrorBoundary, { fallback: fallback, children: _jsx(Component, { ...props }) }));
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};
// Hook for error reporting
export const useErrorHandler = () => {
    const handleError = (error, errorInfo) => {
        console.error('Manual error report:', error, errorInfo);
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send error to monitoring service
            console.error('Production error logged:', {
                error: error.message,
                stack: error.stack,
                info: errorInfo
            });
        }
    };
    return { handleError };
};
