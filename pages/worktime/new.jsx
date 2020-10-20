import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddWorktime from '../../components/Worktime/AddWorktime';

const AddWorktimePage = () => (
  <AuthorizedLayout title='dygit'>
    <AddWorktime />
  </AuthorizedLayout>
);

export default AddWorktimePage;
