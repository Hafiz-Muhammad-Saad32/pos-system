import type { Order, OrderStatus, Paginated } from "@/types";
import {request } from "./apiClient";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

/** Forward-only lifecycle used by the status timeline. */
export const STATUS_FLOW: OrderStatus[] = ["pending", "preparing", "ready", "delivered"];

export interface OrderQuery {
  search?: string;
  status?: OrderStatus | "all";
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "total-desc" | "total-asc";
  page?: number;
  pageSize?: number;
  customerId?: string;
}

const LIST_ALL_PAGE_SIZE = 1000;

export const orderService = {
  /** GET /api/orders */
  list(query: OrderQuery = {}): Promise<Paginated<Order>> {
    return request<Paginated<Order>>({
      method: "GET",
      url: "/orders",
      params: {
        search: query.search,
        status: query.status,
        from: query.from,
        to: query.to,
        sort: query.sort,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        customerId: query.customerId,
      },
    });
  },

  listAll(): Promise<Order[]> {
    return request<Paginated<Order>>({
      method: "GET",
      url: "/orders",
      params: {
        page: 1,
        pageSize: LIST_ALL_PAGE_SIZE,
      },
    }).then((response) => response.data);
  },

  /** GET /api/orders/:id */
  getById(id: string): Promise<Order> {
    return request<Order>({
      method: "GET",
      url: `/orders/${id}`,
    });
  },

  /** PATCH /api/orders/:id/status */
  updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return request<Order>({
      method: "PATCH",
      url: `/orders/${id}/status`,
      data: {
        status,
      },
    });
  },
};
