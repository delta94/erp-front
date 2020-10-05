import {
  useEffect, useCallback, useMemo, useState,
} from 'react';
import Link from 'next/link';
import {
  Button, Table, Badge, Tag, Space, message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';

import styles from './Payments.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import { fetchPayments, generateInvoice } from '../../store/payments/actions';
import { paymentsSelector } from '../../store/payments/selectors';
import {
  EXTENSIONS, ORIGIN_COLORS, PAYMENT_STATUS_COLORS, RESPONSE_MODE,
} from '../../utils/constants';
import { downloadBlob, getFileName } from '../../utils';

const NESTED_COLUMNS = [
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Time',
    dataIndex: 'time',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
  },
];

const Payments = () => {
  const dispatch = useDispatch();
  const [payments, total, loading] = useSelector(paymentsSelector);
  const [pagination, paginationOptions] = usePagination();
  const [queue, setQueue] = useState([]);

  const handleDownload = useCallback(async (row) => {
    setQueue((state) => [...state, row.id]);
    const { data, error, headers } = await dispatch(generateInvoice({
      account: row.account.id,
      project: row.project.id,
      items: row.items,
    }, { silent: true }));
    if (error) message.error(error.response?.data?.message || 'Unable to download invoice');
    if (data) {
      const defaultName = `invoice.${row.id}${EXTENSIONS[data.type]}`;
      const fileName = getFileName(headers['content-disposition']) || defaultName;
      downloadBlob(data, fileName);
      setQueue((state) => {
        const idx = state.findIndex((i) => i === row.id);
        return [...state.slice(0, idx), state.slice(idx + 1)];
      });
    }
  }, [dispatch]);

  const columns = useMemo(() => ([
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
      title: 'Actions',
      render: (row) => (
        <Space size='middle'>
          <Button
            type='link'
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(row)}
            loading={queue.includes(row.id)}
          >
            Invoice
          </Button>
        </Space>
      ),
    },
  ]), [handleDownload, queue]);

  const expandedRowRender = useCallback((row) => (
    <Table
      columns={NESTED_COLUMNS}
      dataSource={row.items.map((item, idx) => ({ ...item, key: idx }))}
      pagination={false}
    />
  ), []);

  useEffect(() => {
    dispatch(fetchPayments({ ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
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
        columns={columns}
        loading={loading}
        dataSource={payments}
        expandable={{ expandedRowRender }}
        pagination={{
          total,
          ...paginationOptions,
        }}
      />
    </>
  );
};

export default Payments;
