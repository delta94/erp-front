export const tagsSelector = (state) => [
  state.tags.data,
  state.tags.total,
  state.tags.loading,
  state.tags.filters,
];

export const tagSelector = (state) => [
  state.tags.item.data,
  state.tags.item.loading,
  state.tags.item.response,
];
