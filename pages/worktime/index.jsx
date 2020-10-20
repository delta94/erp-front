import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Worktime from '../../components/Worktime';

const UsersPage = () => (
  <AuthorizedLayout title='dygit'>
    <Worktime />
  </AuthorizedLayout>
);

export default UsersPage;
