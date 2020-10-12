import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Space, Button, Tag, Popconfirm, message,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

import styles from './Accounts.module.scss';
import Can from '../common/Can';
import HiddenPassword from './components/HiddenPassword';
import GuardedLink from '../common/GuardedLink';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import { ORIGIN_COLORS, PERMISSION, RESPONSE_MODE } from '../../utils/constants';
import { wildcard } from '../../utils';
import { accountsSelector } from '../../store/accounts/selectors';
import { deleteAccount, fetchAccounts } from '../../store/accounts/actions';

const COLUMNS = [
  {
    title: 'Login',
    dataIndex: 'login',
  },
  {
    title: 'Password',
    dataIndex: 'password',
    render: (password, { iv }) => <HiddenPassword iv={iv}>{password}</HiddenPassword>,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (type) => <Tag color={ORIGIN_COLORS[type] || 'default'}>{ type }</Tag>,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    render: (owner) => (
      <GuardedLink
        gate={wildcard(PERMISSION.VIEW_USERS, owner.id)}
        href='/users/[id]'
        as={`/users/${owner.id}`}
        label={owner.name}
      />
    ),
  },
  {
    title: 'Actions',
    render: (v, record) => (
      <>
        <GuardedLink
          gate={wildcard(PERMISSION.EDIT_ACCOUNTS, record.id)}
          as='/accounts/[id]/edit'
          href={`/accounts/${record.id}/edit`}
          hideIfFailed
        >
          <Button type='link' icon={<EditOutlined />}>Edit</Button>
        </GuardedLink>
        <Can
          perform={wildcard(PERMISSION.DELETE_ACCOUNTS, record.id)}
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

const Accounts = () => {
  const dispatch = useDispatch();
  const [accounts, total, loading, filtersData] = useSelector(accountsSelector);
  const [pagination, paginationOptions] = usePagination();
  const [filters, sorting, filterOptions] = useFilters(COLUMNS, filtersData);

  const fetchData = useCallback(() => {
    dispatch(fetchAccounts({
      ...pagination, filters, sorting, mode: RESPONSE_MODE.SIMPLIFIED,
    }));
  }, [dispatch, pagination, filters, sorting]);

  const handleDelete = useCallback(async (id) => {
    const { data, error } = await dispatch(deleteAccount(id));
    if (data) {
      message.success(data);
      fetchData();
    }
    if (error) message.error('Unable to delete account');
  }, [dispatch, fetchData]);

  const dataSource = useMemo(
    () => accounts.map((account) => ({ ...account, handleDelete })),
    [accounts, handleDelete],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Space className={styles.buttons}>
        <Button type='primary'>
          <Link href='/accounts/new'>
            <a>Add</a>
          </Link>
        </Button>
      </Space>
      <Table
        className={styles.rounded}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          total,
          ...paginationOptions,
        }}
        {...filterOptions}
      />
    </>
  );
};

export default Accounts;
