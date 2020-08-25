import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Projects from '../../components/Projects';

const ProjectsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Projects />
  </AuthorizedLayout>
);

export default ProjectsPage;
