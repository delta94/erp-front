import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditAccount from '../../../components/Accounts/EditAccount';

const EditAccountPage = () => (
  <AuthorizedLayout title='dygit'>
    <EditAccount />
  </AuthorizedLayout>
);

export default EditAccountPage;
