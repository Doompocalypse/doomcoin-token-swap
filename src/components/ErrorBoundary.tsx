import React, { Component, ErrorInfo, ReactNode } from 'react';
import CopyButton from './nft/components/CopyButton';

interface Props {
  children: ReactNode;
  fallback: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="p-4 bg-red-900/20 rounded-lg">
          <div className="flex justify-between items-start gap-2">
            <div className="text-red-400">
              <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
              <p className="break-all select-text">{this.state.error.message}</p>
            </div>
            <CopyButton 
              text={this.state.error.message} 
              description="Error message copied to clipboard"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;