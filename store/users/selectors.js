import { createSelector } from 'reselect';

export const usersSelector = (state) => [state.users.data, state.users.total, state.users.loading, state.users.filters];
export const userRolesSelector = (state) => [state.users.roles, state.users.rolesLoading];
export const userSelector = (state) => [state.users.user, state.users.userLoading, state.users.userFound];

export const userRaisesSelector = (state) => [
  state.users.raises.data,
  state.users.raises.total,
  state.users.raises.loading,
  state.users.raises.filter,
];

export const userProjectsSelector = (state) => [
  state.users.projects.data,
  state.users.projects.total,
  state.users.projects.loading,
  state.users.projects.filter,
];

export const userPaymentsSelector = (state) => [
  state.users.payments.data,
  state.users.payments.total,
  state.users.payments.loading,
  state.users.payments.filter,
];

export const userWorktimeSelector = (state) => [
  state.users.worktime.data,
  state.users.worktime.total,
  state.users.worktime.loading,
  state.users.worktime.filter,
];

export const userCalendarSelector = (state) => [
  state.users.calendar.data,
  state.users.calendar.total,
  state.users.calendar.loading,
  state.users.calendar.filter,
];

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
