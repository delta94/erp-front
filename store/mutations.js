export function mapPaginationResponse(state, action) {
  const newState = {
    ...state,
    data: action.response.data.data.map((item) => {
      if (typeof item === 'string') return item;
      const o = { ...item };
      if (item.id) o.key = item.id;
      return o;
    }),
    total: action.response.data.total,
    loading: false,
    response: { ...state.response, found: true },
  };

  if (
    state.filters
    && !Object.keys(state.filters).length
    && JSON.stringify(state.filters) !== JSON.stringify(action.response.data.filters)
  ) {
    newState.filters = action.response.data.filters || { set: true };
  }

  return newState;
}

export function removeDeletedItemFromList(state, action) {
  const itemKey = action.meta.key;
  const newState = {
    ...state,
    loading: false,
  };

  if (itemKey) {
    newState.data = state.data.filter((item) => item.key !== itemKey);
  }

  return newState;
}

/**
 * @param {Object} state
 * @param {Object} action
 * @param {Object|Function} stateOrMutation
 */
export function mutateSubState(state, action, stateOrMutation) {
  const moduleName = action.meta?.subState;
  if (moduleName) {
    if (typeof stateOrMutation === 'function') {
      return { ...state, [moduleName]: stateOrMutation(state[moduleName], action) };
    }
    return { ...state, [moduleName]: { ...state[moduleName], ...stateOrMutation } };
  }
  return { ...state };
}

/**
 * @param {Object} state
 * @param {Object} action
 * @param {Object|Function} stateOrMutation
 * @param {?String} field
 */
export function mutateState(state, action, stateOrMutation, field = null) {
  if (typeof stateOrMutation === 'function') {
    return field
      ? { ...state, [field]: { ...state[field], ...stateOrMutation(state, action) } }
      : { ...state, ...stateOrMutation(state, action) };
  }
  return field ? { ...state, [field]: { ...state[field], ...stateOrMutation } } : { ...state, ...stateOrMutation };
}

/**
 * @param {Object} state
 * @param {Object} action
 */
export function mapSingleEntityResponse(state, action) {
  return {
    ...state,
    item: {
      ...state.item,
      data: action.response.data,
      loading: false,
      response: { ...state.item.response, found: true },
    },
  };
}

/**
 * @param {Object} state
 * @param {Object} action
 * @param {?String} itemField
 */
export function mapError(state, action, itemField = null) {
  const newState = itemField ? { ...state[itemField], loading: false } : { ...state, loading: false };

  switch (action.error?.response?.status) {
    case 404: newState.response.found = false; break;
    case 403: newState.response.forbidden = true; break;
    case 500: newState.response.serverError = true; break;
    default: break;
  }

  return itemField ? { ...state, [itemField]: newState } : newState;
}

/**
 * @param {Object} state
 * @param {Object} action
 */
export function mapAdditionResponse(state, action) {
  if (action.meta.append) {
    return { ...state, data: [...state.data, action.response.data] };
  }
  return state;
}
