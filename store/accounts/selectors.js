import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'accounts';

export const accountsSelector = (state) => entitySelector(ENTITY)(state);

export const accountSelector = (state) => singleEntitySelector(ENTITY)(state);

export const accountCategoriesSelector = (state) => entitySelector(ENTITY, 'categories')(state);

export const accountProjectsSelector = (state) => entitySelector(ENTITY, 'projects')(state);
