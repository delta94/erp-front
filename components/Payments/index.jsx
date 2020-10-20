import {
  useEffect, useCallback, useState, useMemo,
} from 'react';
import Link from 'next/link';
import {
  Button, Table, Badge, Tag, Space, message, Popconfirm,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

import styles from './Payments.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import GuardedLink from '../common/GuardedLink';
import SuspenseLoader from '../common/SuspenseLoader';
import Can from '../common/Can';
import { deletePayment, fetchPayments, generateInvoice } from '../../store/payments/actions';
import { paymentsSelector } from '../../store/payments/selectors';
import {
  EXTENSIONS, ORIGIN_COLORS, PAYMENT_STATUS_COLORS, PERMISSION, RESPONSE_MODE,
} from '../../utils/constants';
import { downloadBlob, getFileName, wildcard } from '../../utils';

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
    title: 'Actions',
    render: (row, record) => (
      <>
        <Button
          type='link'
          icon={<DownloadOutlined />}
          onClick={() => record.handleDownload(row)}
          loading={record.queue.includes(row.id)}
        >
          Invoice
        </Button>
        <GuardedLink
          gate={wildcard(PERMISSION.EDIT_PAYMENTS, record.id)}
          href='/payments/[id]/edit'
          as={`/payments/${record.id}/edit`}
          hideIfFailed
        >
          <Button type='link' icon={<EditOutlined />}>Edit</Button>
        </GuardedLink>
        <Can
          perform={wildcard(PERMISSION.DELETE_PAYMENTS, record.id)}
          yes={(
            <Popconfirm title='Sure to delete?' onConfirm={() => record.handleDelete(record.id)}>
              <Button type='link' danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        />
      </>
    ),
  },
];

const Payments = () => {
  const dispatch = useDispatch();
  const [payments, total, loading] = useSelector(paymentsSelector);
  const [pagination, paginationOptions] = usePagination();
  const [queue, setQueue] = useState([]);

  const fetchData = useCallback(() => {
    dispatch(fetchPayments({ ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
  }, [dispatch, pagination]);

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

  const handleDelete = useCallback(async (id) => {
    const { data, error } = await dispatch(deletePayment(id));
    if (data) {
      message.success(data);
      fetchData();
    }
    if (error) message.error('Unable to delete payment');
  }, [dispatch, fetchData]);

  const expandedRowRender = useCallback((row) => (
    <Table
      columns={NESTED_COLUMNS}
      dataSource={row.items.map((item, idx) => ({ ...item, key: idx }))}
      pagination={false}
    />
  ), []);

  const dataSource = useMemo(
    () => payments.map((payment) => ({
      ...payment, handleDelete, handleDownload, queue,
    })),
    [payments, handleDownload, handleDelete, queue],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink href='/payments/new' gate={PERMISSION.ADD_PAYMENTS} hideIfFailed>
            <Button type='primary'>
              Add
            </Button>
          </GuardedLink>
        </Space>
      </SuspenseLoader>
      <Table
        columns={COLUMNS}
        loading={loading}
        dataSource={dataSource}
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
