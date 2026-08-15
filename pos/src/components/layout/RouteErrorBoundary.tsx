import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Replaces TanStack Router's `errorComponent` on the root route. Catches
 * render errors from any page and shows the same "this page didn't load"
 * recovery UI, with a "Try again" action that clears the error and remounts
 * the subtree, and a "Go home" link.
 *
 * The previous implementation also reported the error to lovable.dev's
 * editor-only telemetry hook (`window.__lovableEvents`) and to a server-side
 * error page (`src/server.ts`) when SSR rendering itself failed. Neither of
 * those exists in a client-only SPA, so this boundary only logs to the
 * console — see the migration changelog for details.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error(error);
  }

  reset = () => {
    this.setState({ error: null });
  };

  override render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={this.reset}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
