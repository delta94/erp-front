export function reducePaginationResponse(action, state) {
  return {
    ...state,
    data: action.response.data.data.map((item) => ({
      key: item.id,
      ...item,
    })),
    total: action.response.data.total,
    loading: false,
  };
}
