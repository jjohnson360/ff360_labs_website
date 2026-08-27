"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of `children` after a render error. Defaults to nothing. */
  fallback?: ReactNode;
  /** Called once when an error is caught (e.g. to log it). */
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
}

/**
 * Minimal client-side error boundary for non-critical subtrees — the R3F hero
 * canvas in particular, where a failed model fetch should degrade to "no 3D"
 * rather than take down the page. Route-level errors are handled by app/error.tsx.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
