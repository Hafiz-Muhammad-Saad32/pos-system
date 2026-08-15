import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import Index from "@/pages/Index";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import OrdersPage from "@/pages/OrdersList";
import OrderDetailsPage from "@/pages/OrderDetails";
import FoodsPage from "@/pages/Foods";
import CustomersPage from "@/pages/CustomersList";
import CustomerDetailsPage from "@/pages/CustomerDetails";
import AnalyticsPage from "@/pages/Analytics";
import { NotFound } from "@/pages/NotFound";

/**
 * Route tree, converted 1:1 from TanStack Router's file-based routes
 * (`src/routes/*.tsx` + generated `routeTree.gen.ts`) to react-router-dom.
 * Route paths, nesting under the root layout, and per-route role guards
 * (`ProtectedPage roles={[...]}`) are unchanged.
 */
export default function App() {
  return (
    <BrowserRouter>
      <RouteErrorBoundary>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedPage>
                  <DashboardPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedPage>
                  <OrdersPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedPage>
                  <OrderDetailsPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/foods"
              element={
                <ProtectedPage roles={["admin"]}>
                  <FoodsPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedPage roles={["admin"]}>
                  <CustomersPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/customers/:customerId"
              element={
                <ProtectedPage roles={["admin"]}>
                  <CustomerDetailsPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedPage roles={["admin"]}>
                  <AnalyticsPage />
                </ProtectedPage>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </RouteErrorBoundary>
    </BrowserRouter>
  );
}
