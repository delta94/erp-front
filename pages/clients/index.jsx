import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Clients from '../../components/Clients';

const ClientsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Clients />
  </AuthorizedLayout>
);

export default ClientsPage;
