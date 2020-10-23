import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Raises from '../../components/Raises';

const RaisesPage = () => (
  <AuthorizedLayout title='dygit'>
    <Raises />
  </AuthorizedLayout>
);

export default RaisesPage;
