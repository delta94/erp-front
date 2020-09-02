import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Button, Table, Badge, Tag,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Payments.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import { fetchPayments } from '../../store/payments/actions';
import { paymentsSelector } from '../../store/payments/selectors';
import { ORIGIN_COLORS, PAYMENT_STATUS_COLORS } from '../../utils/constants';

const COLUMNS = [
  {
    title: 'From',
    dataIndex: 'client',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (client) => <Link href='/clients/[id]' as={`/clients/${client.id}`}><a>{client.name}</a></Link>,
  },
  {
    title: 'To',
    dataIndex: 'user',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (user) => <Link href='/users/[id]' as={`/users/${user.id}`}><a>{user.name}</a></Link>,
  },
  {
    title: 'Account',
    dataIndex: 'account',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (account) => <Tag color={ORIGIN_COLORS[account.type]}>{account.type}</Tag>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => <Badge status={PAYMENT_STATUS_COLORS[status]} text={status} />,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
  {
    title: 'Updated At',
    dataIndex: 'updated_at',
  },
];

const Payments = () => {
  const dispatch = useDispatch();
  const [payments, total, loading] = useSelector(paymentsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    dispatch(fetchPayments(pagination));
  }, [dispatch, pagination]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/payments/new'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Add</a>
          </Link>
        </Button>
      </div>
      <Table
        columns={COLUMNS}
        loading={loading}
        dataSource={payments}
        pagination={{
          total,
          ...paginationOptions,
        }}
      />
    </>
  );
};

export default Payments;
