import crypto from 'crypto-js';

import {
  CURRENCY_SYMBOLS, EXTENSIONS, KEY, SALT,
} from './constants';

/**
 *
 * @typedef {Object} PaginationQuery
 * @property {Number} [page] Current page [1, .., n]
 * @property {Number} [size] Response rows limit [1, .., n]
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
    page = 1, size = 10, mode, filters = [], sorting = [], pagination,
  } = queryObj;
  const query = { skip: (page * size) - size };
  if (size > -1) query.limit = size;
  if (mode) query.mode = mode;
  if (pagination) query.pagination = pagination;
  if (queryObj.with) query.with = queryObj.with;
  if (filters?.length) filters.forEach((filter) => { query[filter.name] = filter.value; });
  if (sorting?.length) {
    sorting.forEach((s) => {
      const order = s.order === 'ascend' ? '' : '-';
      query.sort_by = query.sort_by ? [...query.sort_by, `${order}${s.name}`] : [`${order}${s.name}`];
    });
  }
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
  return data?.values ? data.values.map((item) => ({ text: item, value: item })) : false;
}

export function applySorter(data, sorterFn) {
  return data?.sort ? sorterFn || ((a, b) => a - b) : false;
}

/**
 * Map ant design Table filter object
 *
 * @param {Object} filters
 */
export function mapFilters(filters) {
  return Object.keys(filters).map((item) => ({ name: item, value: filters[item] }));
}

/**
 * Map ant design Table sorter object|array
 *
 * @param {Object|Array} sorting
 */
export function mapSorting(sorting) {
  const result = [];

  if (sorting.length) {
    for (let i = 0; i < sorting.length; i += 1) {
      if (sorting[i].order) result.push({ name: sorting[i].field, order: sorting[i].order });
    }
  } else if (sorting.order) {
    result.push({ name: sorting.field, order: sorting.order });
  }

  return result;
}

export function wildcard(permission, id) {
  return `${permission}.${id}`;
}

export function downloadBlob(blob, fileName) {
  const file = new File([blob], fileName);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 0);
}

/**
 * Content-Disposition header only
 *
 * @param {String} header
 */
export function getFileName(header) {
  const [, group] = /attachment; filename="(.*)"/gm.exec(header);
  return group;
}

export function prefixedName(prefix, name) {
  return prefix ? [prefix, name] : name;
}

export function decryptPassword(password, hexIv) {
  const key = crypto.PBKDF2(KEY, SALT, { hasher: crypto.algo.SHA512, keySize: 64 / 8, iterations: 256 });
  const iv = crypto.enc.Hex.parse(hexIv);
  return crypto.AES.decrypt(password, key, { iv, mode: crypto.mode.CBC }).toString(crypto.enc.Utf8);
}
