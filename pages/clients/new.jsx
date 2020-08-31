import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddClient from '../../components/Clients/AddClient';

const AddClientPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddClient />
  </AuthorizedLayout>
);

export default AddClientPage;
