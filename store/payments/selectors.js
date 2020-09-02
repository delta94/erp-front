export const paymentsSelector = (state) => [state.payments.data, state.payments.total, state.payments.loading];
export const paymentStatusesSelector = (state) => [state.payments.statuses, state.payments.statusesLoading];
