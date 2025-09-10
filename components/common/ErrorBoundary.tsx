import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 text-center max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            죄송합니다. 예상하지 못한 오류가 발생했습니다.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>다시 시도</span>
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function ErrorMessage({ 
  title = "오류가 발생했습니다", 
  message = "요청을 처리하는 중 문제가 발생했습니다.", 
  onRetry,
  className = ""
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center space-x-2 mx-auto">
          <RefreshCw className="h-4 w-4" />
          <span>다시 시도</span>
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "내용이 없습니다",
  message = "표시할 데이터가 없습니다.",
  action,
  icon,
  className = ""
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      {action && action}
    </div>
  );
}