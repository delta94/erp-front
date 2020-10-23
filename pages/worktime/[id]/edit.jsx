import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditUser from '../../../components/Users/EditUser';

const EditWorktimePage = () => (
  <AuthorizedLayout title='dygit'>
    <EditUser />
  </AuthorizedLayout>
);

export default EditWorktimePage;
