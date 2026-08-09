// Parses page/pageSize query params and runs a paginated Mongoose query.
// Returns { data, page, pageSize, total, totalPages } exactly as the frontend expects.

function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 20, 1), 100);
  return { page, pageSize };
}

async function paginate(model, filter, { page, pageSize, sort = { createdAt: -1 } }) {
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

module.exports = { parsePagination, paginate };
