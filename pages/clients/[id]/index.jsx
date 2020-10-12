import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import ClientProfile from '../../../components/Clients/ClientProfile';

const ClientProfilePage = () => (
  <AuthorizedLayout title='dygit'>
    <ClientProfile />
  </AuthorizedLayout>
);

export default ClientProfilePage;
