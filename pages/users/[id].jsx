import AuthorizedLayout from '../../components/common/Layout/Authorized';
import UserProfile from '../../components/Users/UserProfile';

const UserProfilePage = () => (
  <AuthorizedLayout title='dygit'>
    <UserProfile />
  </AuthorizedLayout>
);

export default UserProfilePage;
