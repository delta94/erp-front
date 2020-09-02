import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Expenses from '../../components/Expenses';

const PaymentsPage = () => (
  <AuthorizedLayout title='dygit'>
    <Expenses />
  </AuthorizedLayout>
);

export default PaymentsPage;
