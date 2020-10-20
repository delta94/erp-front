import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Tag, Button, Space,
} from 'antd';
import Link from 'next/link';

import styles from './Users.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import GuardedLink from '../common/GuardedLink';
import InviteModal from './InviteModal/InviteModal';
import Can from '../common/Can';
import SuspenseLoader from '../common/SuspenseLoader';
import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';
import {
  PERMISSION, RESPONSE_MODE, USER_ROLE_COLORS, USER_STATUS_COLORS,
} from '../../utils/constants';

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text, { id }) => <Link href='/users/[id]' as={`/users/${id}`}><a>{text}</a></Link>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'roles',
    render: (roles) => roles.map(
      (role, idx) => (<Tag key={idx.toString()} color={USER_ROLE_COLORS[role] || 'default'}>{role}</Tag>),
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text) => <Tag color={USER_STATUS_COLORS[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const [inviteModalVisible, setInviteModalVisibility] = useState(false);
  const [users, total, loading, filtersData] = useSelector(usersSelector);
  const [pagination, paginationOptions] = usePagination();
  const [filters, sorting, filterOptions] = useFilters(COLUMNS, filtersData);

  const openInviteModal = useCallback(() => setInviteModalVisibility(true), []);

  const closeInviteModal = useCallback(() => setInviteModalVisibility(false), []);

  useEffect(() => {
    dispatch(fetchUsers({
      ...pagination, filters, sorting, mode: RESPONSE_MODE.SIMPLIFIED,
    }));
  }, [dispatch, pagination, filters, sorting]);

  return (
    <>
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink
            gate={PERMISSION.ADD_USERS}
            href='/users/new'
            loading={loading}
            hideIfFailed
          >
            <Button type='primary'>Add</Button>
          </GuardedLink>
          <Can
            perform={PERMISSION.ADD_INVITATIONS}
            yes={<Button type='primary' onClick={openInviteModal}>Invite</Button>}
          />
        </Space>
      </SuspenseLoader>
      <Table
        loading={loading}
        dataSource={users}
        pagination={{
          total,
          ...paginationOptions,
        }}
        {...filterOptions}
      />
      <InviteModal
        visible={inviteModalVisible}
        onCancel={closeInviteModal}
      />
    </>
  );
};

export default Users;
