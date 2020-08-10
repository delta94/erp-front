import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag } from 'antd';

import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';

const ROLE_COLORS = {
  admin: 'cyan',
  manager: 'magenta',
  developer: 'geekblue',
};

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    // eslint-disable-next-line react/display-name
    render: (text) => <a>{text}</a>,
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
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const [users, total, loading] = useSelector(usersSelector);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

  useEffect(() => {
    dispatch(fetchUsers(pagination));
  }, [dispatch, pagination]);

  return (
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
      scroll={{ x: 400 }}
    />
  );
};

export default Users;
