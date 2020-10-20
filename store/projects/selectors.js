import { createSelector } from 'reselect';

import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'projects';

export const projectsSelector = (state) => entitySelector(ENTITY)(state);

export const projectStatusesSelector = (state) => entitySelector(ENTITY, 'statuses')(state);

export const projectAccountsSelector = (state) => entitySelector(ENTITY, 'accounts')(state);

export const projectWorktimeSelector = (state) => entitySelector(ENTITY, 'worktime')(state);

export const projectUsersSelector = (state) => entitySelector(ENTITY, 'users')(state);

export const projectSelector = (state) => singleEntitySelector(ENTITY)(state);

export const projectTotals = (state) => [
  createSelector(
    projectWorktimeSelector,
    ([data]) => data.reduce((all, item) => all + item.time, 0).toFixed(2), // total time
  )(state),
];
