import { Component, type ErrorInfo, type ReactNode } from "react";
import RouteErrorState from "./RouteErrorState";
import { reportError } from "@/lib/report-error";

interface Props {
  children: ReactNode;
  boundary?: string;
  /** Changing this value (route pathname) clears a stale error automatically. */
  resetKey?: string;
}

interface State {
  error: Error | null;
  resetKey?: string;
}

/**
 * Global React error boundary: catches render/lifecycle crashes anywhere in the
 * app shell (including chrome rendered outside the router Outlet).
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AppErrorBoundary caught:", error, info.componentStack);
    reportError(error, {
      boundary: this.props.boundary ?? "app_shell",
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <RouteErrorState
          error={this.state.error}
          boundary={this.props.boundary ?? "app_shell"}
          reset={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
