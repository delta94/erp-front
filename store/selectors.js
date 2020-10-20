/**
 * @param {String} entityName
 * @param {?String=} subState
 */
export const entitySelector = (entityName, subState = null) => (state) => {
  const route = subState ? state[entityName][subState] : state[entityName];
  return [
    route.data,
    route.total,
    route.loading,
    route.filters,
    route.response,
  ];
};

/**
 * @param {String} entityName
 */
export const singleEntitySelector = (entityName) => (state) => [
  state[entityName].item.data,
  state[entityName].item.loading,
  state[entityName].item.response,
];
