import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'clients';

export const clientsSelector = (state) => entitySelector(ENTITY)(state);

export const clientFieldTypesSelector = (state) => entitySelector(ENTITY, 'fieldTypes')(state);

export const clientOriginsSelector = (state) => entitySelector(ENTITY, 'origins')(state);

export const clientSelector = (state) => singleEntitySelector(ENTITY)(state);
