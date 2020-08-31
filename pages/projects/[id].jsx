import AuthorizedLayout from '../../components/common/Layout/Authorized';
import ProjectProfile from '../../components/Projects/ProjectProfile';

const ProjectProfilePage = () => (
  <AuthorizedLayout title='dygit'>
    <ProjectProfile />
  </AuthorizedLayout>
);

export default ProjectProfilePage;
