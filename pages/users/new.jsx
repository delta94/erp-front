import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddUser from '../../components/Users/AddUser';

const AddUserPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddUser />
  </AuthorizedLayout>
);

export default AddUserPage;
