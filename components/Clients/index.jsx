import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag } from 'antd';
import Link from 'next/link';

import styles from './Clients.module.scss';
import { clientsSelector } from '../../store/clients/selectors';
import { fetchClients } from '../../store/clients/actions';
import { ORIGIN_COLORS, RESPONSE_MODE } from '../../utils/constants';

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    // eslint-disable-next-line react/display-name,jsx-a11y/anchor-is-valid
    render: (text, { id }) => <Link href='/clients/[id]' as={`/clients/${id}`}><a>{text}</a></Link>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Origin',
    dataIndex: 'origin',
    // eslint-disable-next-line react/display-name
    render: (origin) => <Tag color={ORIGIN_COLORS[origin]}>{origin}</Tag>,
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
    dispatch(fetchClients({ ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
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
