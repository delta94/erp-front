import { useEffect } from 'react';
import Link from 'next/link';
import { Badge, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusOutlined } from '@ant-design/icons';

import styles from './Worktime.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import useFilters from '../../../../utils/hooks/useFilters';
import EntityAccessMiddleware from '../../../common/EntityAccessMiddleware';
import { STATUS_COLORS } from '../../../../utils/constants';
import { clearUserSubState, fetchUserWorktime } from '../../../../store/users/actions';
import { userWorktimeSelector } from '../../../../store/users/selectors';

const COLUMNS = [
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
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

const ProjectWorktime = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [worktime, total, loading, filtersData, response] = useSelector(userWorktimeSelector);
  const [pagination, paginationOptions] = usePagination();
  const [filters, sorting, filterOptions] = useFilters(COLUMNS, filtersData);

  useEffect(() => {
    if (query.id) dispatch(fetchUserWorktime(query.id, { ...pagination, filters, sorting }));
    return () => dispatch(clearUserSubState('worktime'));
  }, [dispatch, query, pagination, filters, sorting]);

  return (
    <EntityAccessMiddleware entityName='worktime' response={response} loading={loading} mode='simple'>
      <Table
        size='small'
        loading={loading}
        dataSource={worktime}
        scroll={{ x: 600 }}
        className={styles.table}
        showHeader={!!worktime.length}
        pagination={{
          total,
          size: 'small',
          ...paginationOptions,
        }}
        {...filterOptions}
      />
    </EntityAccessMiddleware>
  );
};

export default ProjectWorktime;
