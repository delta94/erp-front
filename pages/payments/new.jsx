import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddPayment from '../../components/Payments/AddPayment';

const AddPaymentPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddPayment />
  </AuthorizedLayout>
);

export default AddPaymentPage;
