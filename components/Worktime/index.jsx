import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space } from 'antd';

import styles from './Worktime.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import GuardedLink from '../common/GuardedLink';
import SuspenseLoader from '../common/SuspenseLoader';
import { PERMISSION, RESPONSE_MODE } from '../../utils/constants';
import { worktimeSelector } from '../../store/worktime/selectors';
import { fetchWorktime } from '../../store/worktime/actions';
import { wildcard } from '../../utils';

const COLUMNS = [
  {
    title: 'Time (h)',
    dataIndex: 'time',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'User',
    dataIndex: 'user',
    render: (user) => (
      <GuardedLink
        href='/users/[id]'
        as={`/users/${user.id}`}
        label={user.name}
        gate={wildcard(PERMISSION.VIEW_USERS, user.id)}
      />
    ),
  },
  {
    title: 'Project',
    dataIndex: 'project',
    render: (project) => (
      <GuardedLink
        href='/projects/[id]'
        as={`/projects/${project.id}`}
        label={project.title}
        gate={wildcard(PERMISSION.VIEW_PROJECTS, project.id)}
      />
    ),
  },
];

const Worktime = () => {
  const dispatch = useDispatch();
  const [worktime, total, loading, filtersData] = useSelector(worktimeSelector);
  const [pagination, paginationOptions] = usePagination();
  const [filters, sorting, filterOptions] = useFilters(COLUMNS, filtersData);

  useEffect(() => {
    dispatch(fetchWorktime({
      ...pagination, filters, sorting, mode: RESPONSE_MODE.SIMPLIFIED,
    }));
  }, [dispatch, pagination, filters, sorting]);

  return (
    <>
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink
            gate={PERMISSION.ADD_WORKTIME}
            href='/worktime/new'
            loading={loading}
            hideIfFailed
          >
            <Button type='primary'>Add</Button>
          </GuardedLink>
        </Space>
      </SuspenseLoader>
      <Table
        loading={loading}
        dataSource={worktime}
        pagination={{
          total,
          ...paginationOptions,
        }}
        {...filterOptions}
      />
    </>
  );
};

export default Worktime;
