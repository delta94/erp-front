export const expensesSelector = (state) => [state.expenses.data, state.expenses.total, state.expenses.loading];
export const expenseStatusesSelector = (state) => [state.expenses.statuses, state.expenses.statusesLoading];
