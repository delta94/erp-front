import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Accounts from '../../components/Accounts';

const UsersPage = () => (
  <AuthorizedLayout title='dygit'>
    <Accounts />
  </AuthorizedLayout>
);

export default UsersPage;
