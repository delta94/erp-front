export const clientsSelector = (state) => [
  state.clients.data,
  state.clients.total,
  state.clients.loading,
  state.clients.filters,
];

export const clientFieldTypesSelector = (state) => [
  state.clients.fieldTypes.data,
  state.clients.fieldTypes.loading,
];

export const clientOriginsSelector = (state) => [
  state.clients.origins.data,
  state.clients.origins.loading,
];

export const clientSelector = (state) => [
  state.clients.client,
  state.clients.clientLoading,
  state.clients.found,
];
