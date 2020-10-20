import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'tags';

export const tagsSelector = (state) => entitySelector(ENTITY)(state);

export const tagSelector = (state) => singleEntitySelector(ENTITY)(state);
