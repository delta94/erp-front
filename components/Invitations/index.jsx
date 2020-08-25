import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button } from 'antd';

import styles from './Invitations.module.scss';
import InviteModal from '../Users/InviteModal/InviteModal';
import { fetchInvitations } from '../../store/invitations/actions';
import { invitationsSelector } from '../../store/invitations/selectors';

const ROLE_COLORS = {
  admin: 'cyan',
  manager: 'magenta',
  developer: 'geekblue',
};

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
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
    title: 'Invited By',
    dataIndex: 'invited_by',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Invitations = () => {
  const dispatch = useDispatch();
  const [inviteModalVisible, setInviteModalVisibility] = useState(false);
  const [invitations, total, loading] = useSelector(invitationsSelector);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

  const openInviteModal = useCallback(() => setInviteModalVisibility(true), []);

  const closeInviteModal = useCallback(() => setInviteModalVisibility(false), []);

  const requestInvitations = useCallback(() => {
    dispatch(fetchInvitations(pagination));
  }, [dispatch, pagination]);

  useEffect(() => {
    requestInvitations();
  }, [requestInvitations]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary' onClick={openInviteModal}>Invite</Button>
      </div>
      <Table
        loading={loading}
        dataSource={invitations}
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
        onFinish={requestInvitations}
      />
    </>
  );
};

export default Invitations;
