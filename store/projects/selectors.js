export const projectsSelector = (state) => [state.projects.data, state.projects.total, state.projects.loading];
export const projectStatusesSelector = (state) => [state.projects.statuses, state.projects.statusesLoading];
