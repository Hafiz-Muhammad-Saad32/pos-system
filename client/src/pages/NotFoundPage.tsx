import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="display-lg mt-3 text-foreground">This page left the kitchen</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has moved. The menu, however, is exactly
          where you left it.
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
