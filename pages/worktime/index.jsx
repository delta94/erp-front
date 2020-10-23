import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Worktime from '../../components/Worktime';

const WorktimePage = () => (
  <AuthorizedLayout title='dygit'>
    <Worktime />
  </AuthorizedLayout>
);

export default WorktimePage;
