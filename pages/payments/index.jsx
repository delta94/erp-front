import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Payments from '../../components/Payments';

const PaymentsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Payments />
  </AuthorizedLayout>
);

export default PaymentsPage;
