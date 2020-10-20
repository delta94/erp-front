import { createSelector } from 'reselect';
import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'users';

export const usersSelector = (state) => entitySelector(ENTITY)(state);

export const userSelector = (state) => singleEntitySelector(ENTITY)(state);

export const userRolesSelector = (state) => entitySelector(ENTITY, 'roles')(state);

export const userStatusesSelector = (state) => entitySelector(ENTITY, 'statuses')(state);

export const userRaisesSelector = (state) => entitySelector(ENTITY, 'raises')(state);

export const userProjectsSelector = (state) => entitySelector(ENTITY, 'projects')(state);

export const userPaymentsSelector = (state) => entitySelector(ENTITY, 'payments')(state);

export const userWorktimeSelector = (state) => entitySelector(ENTITY, 'worktime')(state);

export const userCalendarSelector = (state) => entitySelector(ENTITY, 'calendar')(state);

export const userMappedCalendarSelector = createSelector(
  userCalendarSelector,
  ([items, ...other]) => [
    items.reduce((all, item) => {
      if (all[item.date]) {
        all[item.date].push(item);
      } else {
        // eslint-disable-next-line no-param-reassign
        all[item.date] = [item];
      }
      return all;
    }, {}),
    ...other,
  ],
);
