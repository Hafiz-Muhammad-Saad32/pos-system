import { useEffect } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export function RootErrorBoundary() {
  const routeError = useRouteError();
  const error = routeError instanceof Error ? routeError : new Error(String(routeError));

  useEffect(() => {
    console.error(routeError);
    reportLovableError(error, { boundary: "router_error_element" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeError]);

  if (isRouteErrorResponse(routeError) && routeError.status === 404) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="eyebrow">Error 404</p>
          <h1 className="display-lg mt-3 text-foreground">This page left the kitchen</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The page you're looking for doesn't exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/menu">Explore the menu</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="display-lg text-foreground">This page didn't load</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="rounded-full" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
