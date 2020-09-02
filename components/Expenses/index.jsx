import React, { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Button, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Expenses.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import { CURRENCY_SYMBOLS, PAYMENT_STATUS_COLORS } from '../../utils/constants';
import { fetchExpenses } from '../../store/expenses/actions';
import { expensesSelector } from '../../store/expenses/selectors';

const COLUMNS = [
  {
    title: 'Purpose',
    dataIndex: 'purpose',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (text, { currency }) => `${CURRENCY_SYMBOLS[currency]}${text}`,
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
];

const Expenses = () => {
  const dispatch = useDispatch();
  const [clients, total, loading] = useSelector(expensesSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    dispatch(fetchExpenses(pagination));
  }, [dispatch, pagination]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/expenses/new'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Add</a>
          </Link>
        </Button>
      </div>
      <Table
        columns={COLUMNS}
        loading={loading}
        dataSource={clients}
        pagination={{
          total,
          ...paginationOptions,
        }}
      />
    </>
  );
};

export default Expenses;
