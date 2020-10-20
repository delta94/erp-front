import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'expenses';

export const expensesSelector = (state) => entitySelector(ENTITY)(state);

export const expenseSelector = (state) => singleEntitySelector(ENTITY)(state);

export const expenseStatusesSelector = (state) => entitySelector(ENTITY, 'statuses')(state);
