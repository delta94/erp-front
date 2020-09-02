import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddPayment from '../../components/Payments/AddPayment';

const AddClientPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddPayment />
  </AuthorizedLayout>
);

export default AddClientPage;
