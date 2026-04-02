import React from 'react';

/**
 * Error Boundary component to catch rendering errors and display a fallback UI.
 * Prevents the entire app from crashing when a component throws.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
          <div className="glass-card p-8 rounded-3xl border border-red-500/30 max-w-md text-center">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-3">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">
              {this.props.fallbackMessage || "An unexpected error occurred. Your data is safe."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-gray-800 text-gray-300 px-5 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all font-semibold text-sm"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="bg-red-500/20 text-red-300 px-5 py-2.5 rounded-xl border border-red-500/50 hover:bg-red-500/30 transition-all font-semibold text-sm"
              >
                Reload App
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
