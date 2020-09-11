import React, { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusOutlined } from '@ant-design/icons';

import styles from './Raises.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import { RESPONSE_MODE, STATUS_COLORS } from '../../../../utils/constants';
import { fetchUserRaises } from '../../../../store/users/actions';
import { userRaisesSelector } from '../../../../store/users/selectors';
import { formatCurrency } from '../../../../utils';

const COLUMNS = [
  {
    title: 'Type',
    dataIndex: 'type',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (amount) => formatCurrency(amount),
  },
  {
    title: 'Starting From',
    dataIndex: 'starting_from',
  },
  {
    title: 'Project',
    dataIndex: 'project',
    render: (project) => (project ? (
      <span>
        <Badge status={STATUS_COLORS[project.status]} className={styles.badge} />
        <Link href='/projects/[id]' as={`/projects/${project.id}`}>
          <a>{ project.title }</a>
        </Link>
      </span>
    ) : (<MinusOutlined />)),
  },
];

const UserRaises = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [projects, total, loading] = useSelector(userRaisesSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    if (query.id) dispatch(fetchUserRaises(query.id, { ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
  }, [dispatch, query, pagination]);

  return (
    <Table
      size='small'
      loading={loading}
      dataSource={projects}
      columns={COLUMNS}
      scroll={{ x: 600 }}
      className={styles.table}
      showHeader={!!projects.length}
      pagination={{
        total,
        size: 'small',
        ...paginationOptions,
      }}
    />
  );
};

export default UserRaises;
