import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'raises';

export const raisesSelector = (state) => entitySelector(ENTITY)(state);

export const raiseSelector = (state) => singleEntitySelector(ENTITY)(state);
