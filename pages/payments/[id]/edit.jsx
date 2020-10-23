import AuthorizedLayout from '../../../components/common/Layout/Authorized';
import EditPayment from '../../../components/Payments/EditPayment';

const EditPaymentPage = () => (
  <AuthorizedLayout title='dygit'>
    <EditPayment />
  </AuthorizedLayout>
);

export default EditPaymentPage;
