import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/store/auth";
import { ThemeProvider } from "@/store/theme";
import { Toaster } from "@/components/ui/sonner";

/**
 * App shell that wraps every route. Equivalent to the previous
 * `RootComponent` in `src/routes/__root.tsx`, minus the SSR-only
 * `<html>/<head>/<Scripts>` shell (now handled by `index.html`) and the
 * QueryClientProvider (there's no longer a single shared client to provide —
 * see `src/lib/query`).
 */
export function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}
