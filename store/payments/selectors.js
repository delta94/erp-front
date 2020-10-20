import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'payments';

export const paymentsSelector = (state) => entitySelector(ENTITY)(state);

export const paymentSelector = (state) => singleEntitySelector(ENTITY)(state);

export const paymentStatusesSelector = (state) => entitySelector(ENTITY, 'statuses')(state);
