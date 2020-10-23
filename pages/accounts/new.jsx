import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddAccount from '../../components/Accounts/AddAccount';

const AddAccountPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddAccount />
  </AuthorizedLayout>
);

export default AddAccountPage;
