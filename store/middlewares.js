/* eslint-disable no-param-reassign */
import * as accountTypes from './accounts/types';
import * as authTypes from './auth/types';
import * as clientTypes from './clients/types';
import * as expenseTypes from './expenses/types';
import * as invitationTypes from './invitations/types';
import * as paymentTypes from './payments/types';
import * as photoTypes from './photos/types';
import * as projectTypes from './projects/types';
import * as userTypes from './users/types';

const MAP = {
  auth: authTypes,
  users: userTypes,
  projects: projectTypes,
  clients: clientTypes,
  payments: paymentTypes,
  accounts: accountTypes,
  expenses: expenseTypes,
  invitations: invitationTypes,
  photos: photoTypes,
};

export const addModuleNameToAction = () => (next) => (action) => {
  const modules = Object.keys(MAP);
  for (let i = 0; i < modules.length; i += 1) {
    if (Object.values(MAP[modules[i]]).includes(action.type)) action.module = modules[i];
  }
  next(action);
};

export default [
  addModuleNameToAction,
];
