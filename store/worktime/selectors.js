import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'worktime';

export const worktimeSelector = (state) => entitySelector(ENTITY)(state);

export const worktimeItemSelector = (state) => singleEntitySelector(ENTITY)(state);
