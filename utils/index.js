import { CURRENCY_SYMBOLS, EXTENSIONS } from './constants';

/**
 *
 * @typedef {Object} PaginationQuery
 * @property {Number} [page] Current page [1, .., n]
 * @property {Number} [size] Response rows limit [1, .., n]
 * @property {String} [sortBy] Sort by certain field
 * @property {String} [mode] Response mode
 * @property {String} [searchTerm] Search term to filter result
 * @property {Boolean} [descending] Records order
 * @property {Object} [filters] Filters object
 *
 */

/**
 * @param {PaginationQuery} queryObj
 */
export function composeQuery(queryObj = { page: 1, size: 10 }) {
  const {
    page = 1, size = 10, mode, roles, filters = [],
  } = queryObj;
  const query = { skip: (page * size) - size };
  if (size > -1) query.limit = size;
  if (mode) query.mode = mode;
  if (roles) query.role = roles;
  if (filters) filters.forEach((filter) => { query[filter.name] = filter.value; });
  return query;
}

/**
 * @param {Object[]} errors
 * @param {String=} replaceMessageWith
 * @param {Object=} values
 */
export function parseErrors(errors, replaceMessageWith = null, values = null) {
  const erroredFields = Object.keys(errors);
  const fields = [];
  for (let i = 0; i < erroredFields.length; i += 1) {
    const namePath = erroredFields[i].split('.').map((part) => (Number.isNaN(+part) ? part : +part));
    // validate photo existence
    if (namePath[0] === 'photos' && values) {
      const val = [...values[namePath[0]]];
      if (val[namePath[1]]) {
        val[namePath[1]] = {
          ...val[namePath[1]],
          status: 'error',
          response: replaceMessageWith || 'Photo is not exists. Try to re-upload',
        };
      }
      fields.push({
        name: namePath[0],
        value: val,
      });
    } else {
      fields.push({
        name: namePath,
        errors: replaceMessageWith || errors[erroredFields[i]],
      });
    }
  }
  return fields;
}

/**
 * @param {String} str
 */
export function ucFirst(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function generateUID() {
  // eslint-disable-next-line no-bitwise
  return `${(~~(Math.random() * 1e8)).toString(16)}`;
}

/**
 * @param {Blob} blob
 * @param {String=} fileName
 */
export function blobToFile(blob, fileName = null) {
  const uid = generateUID();
  // eslint-disable-next-line no-param-reassign
  if (!fileName) fileName = `${uid}.${EXTENSIONS[blob.type]}`;
  const file = new File([blob], fileName, {
    type: blob.type,
  });
  file.uid = uid;
  return file;
}

export function getCookies() {
  return typeof document !== 'undefined'
    ? document.cookie
      .split(';')
      .reduce((res, c) => {
        const [key, val] = c.trim().split('=').map(decodeURIComponent);
        const allNumbers = (str) => /^\d+$/.test(str);
        try {
          return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) });
        } catch (e) {
          return Object.assign(res, { [key]: val });
        }
      }, {})
    : {};
}

export function getXsrfToken() {
  const cookies = getCookies();
  return cookies['XSRF-TOKEN'] ? decodeURI(cookies['XSRF-TOKEN']) : null;
}

export function clearErrors(values) {
  const fieldNames = Object.keys(values);
  const fields = [];
  for (let i = 0; i < fieldNames.length; i += 1) {
    fields.push({
      name: fieldNames[i],
      value: values[fieldNames[i]],
      errors: [],
    });
  }
  return fields;
}

export function normFile(e) {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
}

export function filterByLabel(val, option) {
  return option.label.match(new RegExp(val, 'ig'));
}

export function mapOptions(array) {
  return array.map((item) => (typeof item === 'object'
    ? { label: (item.name ?? item.title), value: item.id }
    : { label: item, value: item }));
}

export function formatCurrency(amount, symbol = CURRENCY_SYMBOLS.usd) {
  return `${symbol} ${new Intl.NumberFormat().format(amount)}`;
}

export function applyFilter(data) {
  return data ? data.map((item) => ({ text: item, value: item })) : false;
}

/**
 * Map ant design Table filter object
 *
 * @param {Object} filters
 */
export function mapFilters(filters) {
  return Object.keys(filters).map((item) => ({ name: item, value: filters[item] }));
}
