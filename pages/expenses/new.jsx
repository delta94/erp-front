import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddExpense from '../../components/Expenses/AddExpense';

const AddExpensePage = () => (
  <AuthorizedLayout title='dygit'>
    <AddExpense />
  </AuthorizedLayout>
);

export default AddExpensePage;
