import { createSelector } from 'reselect';

export const projectsSelector = (state) => [
  state.projects.data,
  state.projects.total,
  state.projects.loading,
  state.projects.filters,
];

export const projectStatusesSelector = (state) => [
  state.projects.statuses.data,
  state.projects.statuses.total,
  state.projects.statuses.loading,
  state.projects.statuses.filters,
];

export const projectAccountsSelector = (state) => [
  state.projects.accounts.data,
  state.projects.accounts.total,
  state.projects.accounts.loading,
  state.projects.accounts.filters,
];

export const projectWorktimeSelector = (state) => [
  state.projects.worktime.data,
  state.projects.worktime.total,
  state.projects.worktime.loading,
  state.projects.worktime.filters,
];

export const projectTotals = (state) => [
  createSelector(
    projectWorktimeSelector,
    ([data]) => data.reduce((all, item) => all + item.time, 0).toFixed(2), // total time
  )(state),
];
