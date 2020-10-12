import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddAccount from '../../components/Accounts/AddAccount';

const AddUserPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddAccount />
  </AuthorizedLayout>
);

export default AddUserPage;
