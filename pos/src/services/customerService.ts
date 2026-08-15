import type { Customer, Order } from "@/types";
import type { Paginated } from "@/types";
import { request } from "./apiClient";

export interface CustomerQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: "recent" | "spend" | "orders" | "name";
}

export const customerService = {
  /** GET /api/customers */
  list(query: CustomerQuery = {}): Promise<Paginated<Customer>> {
    return request<Paginated<Customer>>({
      method: "GET",
      url: "/customers",
      params: {
        search: query.search,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 8,
        sort: query.sort,
      },
    });
  },

  /** GET /api/customers/:id */
  getById(id: string): Promise<{ customer: Customer; orders: Order[] }> {
    return request<{ customer: Customer; orders: Order[] }>({
      method: "GET",
      url: `/customers/${id}`,
    });
  },
};
