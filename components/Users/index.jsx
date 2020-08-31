import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button } from 'antd';
import Link from 'next/link';

import styles from './Users.module.scss';
import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';
import InviteModal from './InviteModal/InviteModal';

const ROLE_COLORS = {
  admin: 'cyan',
  manager: 'magenta',
  developer: 'geekblue',
};

const STATUS_COLORS = {
  'day off': 'cyan',
  active: 'green',
  vacation: 'geekblue',
  'on sick leave': 'red',
};

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (text, { id }) => <Link href='/users/[id]' as={`/users/${id}`}><a>{text}</a></Link>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    // eslint-disable-next-line react/display-name
    render: (text) => <Tag color={ROLE_COLORS[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    // eslint-disable-next-line react/display-name
    render: (text) => <Tag color={STATUS_COLORS[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const [inviteModalVisible, setInviteModalVisibility] = useState(false);
  const [users, total, loading] = useSelector(usersSelector);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

  const openInviteModal = useCallback(() => setInviteModalVisibility(true), []);

  const closeInviteModal = useCallback(() => setInviteModalVisibility(false), []);

  useEffect(() => {
    dispatch(fetchUsers(pagination));
  }, [dispatch, pagination]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/users/new'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Add</a>
          </Link>
        </Button>
        <Button type='primary' onClick={openInviteModal}>Invite</Button>
      </div>
      <Table
        loading={loading}
        dataSource={users}
        columns={COLUMNS}
        pagination={{
          total,
          showSizeChanger: true,
          onShowSizeChange: handlePaginationChange,
          onChange: handlePaginationChange,
        }}
      />
      <InviteModal
        visible={inviteModalVisible}
        onCancel={closeInviteModal}
      />
    </>
  );
};

export default Users;
