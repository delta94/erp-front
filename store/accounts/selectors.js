export const accountsSelector = (state) => [
  state.accounts.data,
  state.accounts.total,
  state.accounts.loading,
  state.accounts.filters,
];

export const accountSelector = (state) => [
  state.accounts.item.data,
  state.accounts.item.loading,
  state.accounts.item.response,
];
