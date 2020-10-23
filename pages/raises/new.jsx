import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddRaise from '../../components/Raises/AddRaise';

const AddRaisePage = () => (
  <AuthorizedLayout title='dygit'>
    <AddRaise />
  </AuthorizedLayout>
);

export default AddRaisePage;
