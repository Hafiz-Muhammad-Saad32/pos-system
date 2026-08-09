import type {
  AnalyticsRange,
  DashboardStats,
  Food,
  OrderStatus,
  PopularFood,
  SalesPoint,
} from "@/types";
import { request } from "./apiClient";

export const analyticsService = {
  stats(): Promise<DashboardStats> {
    return request<DashboardStats>({
      method: "GET",
      url: "/analytics/stats",
    });
  },

  salesSeries(range: AnalyticsRange = "daily"): Promise<SalesPoint[]> {
    return request<SalesPoint[]>({
      method: "GET",
      url: "/analytics/sales",
      params: {
        range,
      },
    });
  },

  popularFoods(limit = 5): Promise<PopularFood[]> {
    return request<PopularFood[]>({
      method: "GET",
      url: "/analytics/popular-foods",
      params: {
        limit,
      },
    });
  },

  statusBreakdown(): Promise<Array<{ status: OrderStatus; count: number }>> {
    return request<Array<{ status: OrderStatus; count: number }>>({
      method: "GET",
      url: "/analytics/status-breakdown",
    });
  },

  unavailableFoods(): Promise<Food[]> {
    return request<Food[]>({
      method: "GET",
      url: "/analytics/unavailable-foods",
    });
  },

  summary(
    range: AnalyticsRange = "daily",
  ): Promise<{ revenue: number; orders: number; avgOrderValue: number; series: SalesPoint[] }> {
    return request<{
      revenue: number;
      orders: number;
      avgOrderValue: number;
      series: SalesPoint[];
    }>({
      method: "GET",
      url: "/analytics/summary",
      params: {
        range,
      },
    });
  },
};
