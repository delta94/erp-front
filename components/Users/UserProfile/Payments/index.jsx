import { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Projects.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import { ORIGIN_COLORS, PAYMENT_STATUS_COLORS, RESPONSE_MODE } from '../../../../utils/constants';
import { clearUserSubState, fetchUserPayments } from '../../../../store/users/actions';
import { userPaymentsSelector } from '../../../../store/users/selectors';
import { formatCurrency } from '../../../../utils';

const COLUMNS = [
  {
    title: 'From',
    dataIndex: 'client',
    render: (item) => (
      <Link href='/clients/[id]' as={`/clients/${item.id}`}>
        <a>{ item.name }</a>
      </Link>
    ),
  },
  {
    title: 'Account',
    dataIndex: 'account',
    render: (item) => <Tag color={ORIGIN_COLORS[item.type]}>{ item.type }</Tag>,
  },
  {
    title: 'Purpose',
    dataIndex: 'purpose',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (amount) => formatCurrency(amount),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => <Badge status={PAYMENT_STATUS_COLORS[status]} text={status} />,
  },
];

const UserPayments = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [payments, total, loading] = useSelector(userPaymentsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    if (query.id) dispatch(fetchUserPayments(query.id, { ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
    return () => dispatch(clearUserSubState('payments'));
  }, [dispatch, query, pagination]);

  return (
    <Table
      size='small'
      loading={loading}
      dataSource={payments}
      columns={COLUMNS}
      scroll={{ x: 600 }}
      className={styles.table}
      showHeader={!!payments.length}
      pagination={{
        total,
        size: 'small',
        ...paginationOptions,
      }}
    />
  );
};

export default UserPayments;
