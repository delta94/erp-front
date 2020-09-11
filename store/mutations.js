export function reducePaginationResponse(state, action) {
  const newState = {
    ...state,
    data: action.response.data.data.map((item) => {
      const o = { ...item };
      if (item.id) o.key = item.id;
      return o;
    }),
    total: action.response.data.total,
    loading: false,
  };

  if (state.filters && !Object.keys(state.filters).length) {
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
