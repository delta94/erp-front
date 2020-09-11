export const invitationsSelector = (state) => [
  state.invitations.data,
  state.invitations.total,
  state.invitations.loading,
];
export const invitationSelector = (state) => [
  state.invitations.invitation,
  state.invitations.invitationLoading,
  state.invitations.invitationFound,
];
