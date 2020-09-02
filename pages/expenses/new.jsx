import AuthorizedLayout from '../../components/common/Layout/Authorized';
import AddExpense from '../../components/Expenses/AddExpense';

const AddClientPage = () => (
  <AuthorizedLayout title='dygit'>
    <AddExpense />
  </AuthorizedLayout>
);

export default AddClientPage;
