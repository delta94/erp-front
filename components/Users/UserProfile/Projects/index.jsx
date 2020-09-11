import React, { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Projects.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import { RESPONSE_MODE, STATUS_COLORS } from '../../../../utils/constants';
import { fetchUserProjects } from '../../../../store/users/actions';
import { userProjectsSelector } from '../../../../store/users/selectors';

const COLUMNS = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (title, { id, status }) => (
      <span>
        <Badge status={STATUS_COLORS[status]} className={styles.badge} />
        <Link href='/projects/[id]' as={`/projects/${id}`}>
          <a>{ title }</a>
        </Link>
      </span>
    ),
  },
  {
    title: 'Total Worked (hrs)',
    dataIndex: 'total_worktime',
  },
  {
    title: 'This Month (hrs)',
    dataIndex: 'worktime_this_month',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    render: (rate, { salary_based: salaryBased }) => `$ ${new Intl.NumberFormat().format(rate)} ${salaryBased ? 'monthly' : 'hourly'}`,
  },
];

const UserProjects = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [projects, total, loading] = useSelector(userProjectsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    if (query.id) dispatch(fetchUserProjects(query.id, { ...pagination, mode: RESPONSE_MODE.SIMPLIFIED }));
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

export default UserProjects;
