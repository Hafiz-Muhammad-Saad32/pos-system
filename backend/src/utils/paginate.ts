import type { Model, FilterQuery } from "mongoose";

// Parses page/pageSize query params and runs a paginated Mongoose query.
// Returns { data, page, pageSize, total, totalPages } exactly as the frontend expects.

interface PaginationQuery {
  page?: unknown;
  pageSize?: unknown;
}

function parsePagination(query: PaginationQuery): { page: number; pageSize: number } {
  const page = Math.max(parseInt(query.page as string, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize as string, 10) || 20, 1), 100);
  return { page, pageSize };
}

interface PaginateOptions {
  page: number;
  pageSize: number;
  sort?: Record<string, 1 | -1>;
}

interface PaginateResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

async function paginate<T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  { page, pageSize, sort = { createdAt: -1 } }: PaginateOptions
): Promise<PaginateResult<T>> {
  const skip = (page - 1) * pageSize;
  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(pageSize),
    model.countDocuments(filter),
  ]);

  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

export { parsePagination, paginate };
