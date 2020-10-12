import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditClient from '../../../components/Clients/EditClient';

const EditClientPage = () => (
  <AuthorizedLayout title='dygit'>
    <EditClient />
  </AuthorizedLayout>
);

export default EditClientPage;
