import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error("Application render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-light p-6">
          <div className="surface max-w-md p-6 text-center">
            <h1 className="text-xl font-bold text-stone-950">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Please refresh the page. If this continues, check the browser
              console for the exact error.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
