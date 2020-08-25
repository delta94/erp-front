import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Users from '../../components/Users';

const UsersPage = () => (
  <AuthorizedLayout title='dygit'>
    <Users />
  </AuthorizedLayout>
);

export default UsersPage;
