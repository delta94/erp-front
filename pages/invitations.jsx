import AuthorizedLayout from '../components/common/Layout/Authorized';
import Invitations from '../components/Invitations';

const InvitationsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Invitations />
  </AuthorizedLayout>
);

export default InvitationsPage;
