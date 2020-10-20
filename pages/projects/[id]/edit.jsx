import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditProject from '../../../components/Projects/EditProject';

const AddProjectPage = () => (
  <AuthorizedLayout title='dygit'>
    <EditProject />
  </AuthorizedLayout>
);

export default AddProjectPage;
