import { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from '../Clients.module.scss';
import usePagination from '../../../utils/hooks/usePagination';
import EntityAccessMiddleware from '../../common/EntityAccessMiddleware';
import { PAYMENT_STATUS_COLORS, RESPONSE_MODE } from '../../../utils/constants';
import { clearClientsSubState, fetchClientPayments } from '../../../store/clients/actions';
import { clientPaymentsSelector } from '../../../store/clients/selectors';

const COLUMNS = [
  {
    title: 'Avatar',
    dataIndex: 'account',
    render: (account, { status }) => (
      <span>
        <Badge status={PAYMENT_STATUS_COLORS[status]} className={styles.badge} />
        <Link href='/accounts/[id]' as={`/accounts/${account?.id}`}>
          <a>{ account.name }</a>
        </Link>
      </span>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const ClientPayments = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [payments, total, loading, , response] = useSelector(clientPaymentsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    if (query.id) {
      dispatch(
        fetchClientPayments(query.id, { ...pagination, mode: RESPONSE_MODE.MINIMAL, with: ['account'] }),
      );
    }
    return () => dispatch(clearClientsSubState('payments'));
  }, [dispatch, query, pagination]);

  return (
    <EntityAccessMiddleware entityName='payments' loading={loading} response={response} mode='simple'>
      <Table
        size='small'
        loading={loading}
        dataSource={payments}
        columns={COLUMNS}
        scroll={{ x: 600 }}
        className={styles.smallTable}
        showHeader={!!payments.length}
        pagination={{
          total,
          size: 'small',
          ...paginationOptions,
        }}
      />
    </EntityAccessMiddleware>
  );
};

export default ClientPayments;
