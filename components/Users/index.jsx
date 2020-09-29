import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button } from 'antd';
import Link from 'next/link';

import styles from './Users.module.scss';
import InviteModal from './InviteModal/InviteModal';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';
import { RESPONSE_MODE, USER_ROLE_COLORS, USER_STATUS_COLORS } from '../../utils/constants';

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
    dataIndex: 'role',
    render: (text) => <Tag color={USER_ROLE_COLORS[text] || 'default'}>{text}</Tag>,
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
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/users/new'>
            <a>Add</a>
          </Link>
        </Button>
        <Button type='primary' onClick={openInviteModal}>Invite</Button>
      </div>
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
