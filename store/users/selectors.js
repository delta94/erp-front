export const usersSelector = (state) => [state.users.data, state.users.total, state.users.loading];
export const userRolesSelector = (state) => [state.users.roles, state.users.rolesLoading];
