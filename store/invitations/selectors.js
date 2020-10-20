import { entitySelector, singleEntitySelector } from '../selectors';

const ENTITY = 'invitations';

export const invitationsSelector = (state) => entitySelector(ENTITY)(state);

export const invitationSelector = (state) => singleEntitySelector(ENTITY)(state);
