import { useCallback, useEffect, useMemo } from 'react';
import {
  Button, message, Popconfirm, Popover, Space, Table, Tag, Tooltip,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Accounts.module.scss';
import HiddenPassword from './components/HiddenPassword';
import GuardedLink from '../common/GuardedLink';
import SuspenseLoader from '../common/SuspenseLoader';
import Can from '../common/Can';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import { wildcard } from '../../utils';
import { accountsSelector } from '../../store/accounts/selectors';
import { deleteAccount, fetchAccounts } from '../../store/accounts/actions';
import {
  ACCOUNT_CATEGORY,
  ACCOUNT_CATEGORY_COLOR,
  ACCOUNT_CATEGORY_ICON, ORIGIN_COLORS, PERMISSION, RESPONSE_MODE,
} from '../../utils/constants';

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
    title: 'Category',
    dataIndex: 'category',
    render: (category, record) => {
      const Icon = ACCOUNT_CATEGORY_ICON[category];
      const tag = (
        <Tag color={ACCOUNT_CATEGORY_COLOR[category] || 'default'}>
          <Icon />
          &nbsp;
          { category }
        </Tag>
      );

      if (ACCOUNT_CATEGORY.PROJECT && record.project) {
        const content = (
          <GuardedLink
            gate={wildcard(PERMISSION.VIEW_PROJECTS, record.project.id)}
            href='/projects/[id]'
            as={`/projects/${record.project.id}`}
            label={record.project.title}
          />
        );
        return (
          <Popover content={content}>
            { tag }
          </Popover>
        );
      }

      return tag;
    },
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    render: (ownerOrParentAccount) => (ownerOrParentAccount.category === ACCOUNT_CATEGORY.AVATAR
      ? (
        <GuardedLink
          gate={wildcard(PERMISSION.VIEW_ACCOUNTS, ownerOrParentAccount.id)}
          href='/accounts/[id]/edit'
          as={`/accounts/${ownerOrParentAccount.id}/edit`}
        >
          <Tooltip title='This account is owned by another account'>
            <Tag color={ownerOrParentAccount.color}>
              { ownerOrParentAccount.type }
            </Tag>
          </Tooltip>
          &nbsp;
          { ownerOrParentAccount.name }
        </GuardedLink>
      ) : (
        <GuardedLink
          gate={wildcard(PERMISSION.VIEW_USERS, ownerOrParentAccount.id)}
          href='/users/[id]'
          as={`/users/${ownerOrParentAccount.id}`}
          label={ownerOrParentAccount.name}
        />
      )),
  },
  {
    title: 'Actions',
    render: (v, record) => (
      <>
        <GuardedLink
          gate={wildcard(PERMISSION.EDIT_ACCOUNTS, record.id)}
          href='/accounts/[id]/edit'
          as={`/accounts/${record.id}/edit`}
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
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink href='/accounts/new' gate={PERMISSION.ADD_ACCOUNTS} hideIfFailed>
            <Button type='primary'>
              Add
            </Button>
          </GuardedLink>
        </Space>
      </SuspenseLoader>
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
