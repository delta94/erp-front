import { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from '../Clients.module.scss';
import usePagination from '../../../utils/hooks/usePagination';
import EntityAccessMiddleware from '../../common/EntityAccessMiddleware';
import { RESPONSE_MODE, STATUS_COLORS } from '../../../utils/constants';
import { clearClientsSubState, fetchClientProjects } from '../../../store/clients/actions';
import { clientProjectsSelector } from '../../../store/clients/selectors';

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
    dataIndex: ['totals', 'total_worktime'],
  },
  {
    title: 'This Month (hrs)',
    dataIndex: ['totals', 'worktime_this_month'],
  },
  {
    title: 'Team members amount',
    dataIndex: ['totals', 'team_count'],
  },
];

const ClientProjects = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [projects, total, loading, , response] = useSelector(clientProjectsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    if (query.id) {
      dispatch(
        fetchClientProjects(query.id, { ...pagination, mode: RESPONSE_MODE.SIMPLIFIED, with: ['totals'] }),
      );
    }
    return () => dispatch(clearClientsSubState('projects'));
  }, [dispatch, query, pagination]);

  return (
    <EntityAccessMiddleware entityName='projects' loading={loading} response={response} mode='simple'>
      <Table
        size='small'
        loading={loading}
        dataSource={projects}
        columns={COLUMNS}
        scroll={{ x: 600 }}
        className={styles.smallTable}
        showHeader={!!projects.length}
        pagination={{
          total,
          size: 'small',
          ...paginationOptions,
        }}
      />
    </EntityAccessMiddleware>
  );
};

export default ClientProjects;
