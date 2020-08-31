export const clientsSelector = (state) => [state.clients.data, state.clients.total, state.clients.loading];
export const clientFieldTypesSelector = (state) => [state.clients.fieldTypes, state.clients.fieldTypesLoading];
export const clientOriginsSelector = (state) => [state.clients.origins, state.clients.originsLoading];
export const clientSelector = (state) => [state.clients.client, state.clients.clientLoading, state.clients.clientFound];
