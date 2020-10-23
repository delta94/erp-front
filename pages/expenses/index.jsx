import AuthorizedLayout from '../../components/common/Layout/Authorized';
import Expenses from '../../components/Expenses';

const ExpensesPage = () => (
  <AuthorizedLayout title='dygit'>
    <Expenses />
  </AuthorizedLayout>
);

export default ExpensesPage;
