import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Accounts from '../../components/Accounts';

const AccountsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Accounts />
  </AuthorizedLayout>
);

export default AccountsPage;
