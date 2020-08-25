import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag } from 'antd';
import { MinusOutlined } from '@ant-design/icons';

import Link from 'next/link';
import styles from './Clients.module.scss';
import { clientsSelector } from '../../store/clients/selectors';
import { fetchClients } from '../../store/clients/actions';

const ORIGIN_COLORS = {
  upwork: 'green',
  freelancer: 'geekblue',
  linkedin: 'blue',
};

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Found On',
    dataIndex: 'found_on',
    // eslint-disable-next-line react/display-name
    render: (origin) => <Tag color={ORIGIN_COLORS[origin]}>{origin}</Tag>,
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    // eslint-disable-next-line react/display-name
    render: (notes) => (notes
      ? notes.map((note, idx) => <p key={idx.toString()}>{note}</p>)
      : <MinusOutlined />),
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Clients = () => {
  const dispatch = useDispatch();
  const [clients, total, loading] = useSelector(clientsSelector);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

  useEffect(() => {
    dispatch(fetchClients(pagination));
  }, [dispatch, pagination]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/clients/new'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Add</a>
          </Link>
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={clients}
        columns={COLUMNS}
        pagination={{
          total,
          showSizeChanger: true,
          onShowSizeChange: handlePaginationChange,
          onChange: handlePaginationChange,
        }}
      />
    </>
  );
};

export default Clients;