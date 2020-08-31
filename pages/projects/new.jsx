import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddProject from '../../components/Projects/AddProject';

const AddProjectPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddProject />
  </AuthorizedLayout>
);

export default AddProjectPage;
