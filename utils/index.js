/**
 *
 * @typedef {Object} PaginationQuery
 * @property {Number} page Current page [1, .., n]
 * @property {Number} size Response rows limit [1, .., n]
 * @property {String} [sortBy] Sort by certain field
 * @property {String} [searchTerm] Search term to filter result
 * @property {Boolean} [descending] Records order
 *
 */

/**
 * @param {PaginationQuery} queryObj
 */
export function composeQuery(queryObj = { page: 1, size: 10 }) {
  const { page, size } = queryObj;
  const query = { skip: (page * size) - size };
  if (size > -1) query.limit = size;
  return query;
}
