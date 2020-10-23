import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditRaise from '../../../components/Raises/EditRaise';

const EditRaisePage = () => (
  <AuthorizedLayout title='dygit'>
    <EditRaise />
  </AuthorizedLayout>
);

export default EditRaisePage;
