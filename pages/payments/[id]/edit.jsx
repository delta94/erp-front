import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditPayment from '../../../components/Payments/EditPayment';

const AddClientPage = () => (
  <AuthorizedLayout title='dygit'>
    <EditPayment />
  </AuthorizedLayout>
);

export default AddClientPage;
