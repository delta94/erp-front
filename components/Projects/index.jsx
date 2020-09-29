import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Button, Badge,
} from 'antd';
import Link from 'next/link';

import styles from './Projects.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import GuardedLink from '../common/GuardedLink';
import { projectsSelector } from '../../store/projects/selectors';
import { fetchProjects } from '../../store/projects/actions';
import { PERMISSION, STATUS_COLORS } from '../../utils/constants';
import { wildcard } from '../../utils';

const COLUMNS = [
  {
    title: 'Title',
    dataIndex: 'title',
    // eslint-disable-next-line jsx-a11y/anchor-is-valid,react/display-name
    render: (text, { id }) => <Link href={`/projects/${id}`}><a>{text}</a></Link>,
  },
  {
    title: 'Developers',
    dataIndex: 'developers',
    render: (data) => (
      <ul className={styles.list}>
        {
          data.map((item, idx) => (
            <li key={idx.toString()}>
              <GuardedLink
                gates={[PERMISSION.VIEW_USERS, PERMISSION.VIEW_DEVELOPERS, wildcard(PERMISSION.VIEW_USERS, item.id)]}
                href={`/users/${item.id}`}
                label={item.name}
              />
            </li>
          ))
        }
      </ul>
    ),
  },
  {
    title: 'Managers',
    dataIndex: 'managers',
    render: (data) => (
      <ul className={styles.list}>
        {
          data.map((item, idx) => (
            <li key={idx.toString()}>
              <GuardedLink
                gates={[PERMISSION.VIEW_USERS, PERMISSION.VIEW_MANAGERS, wildcard(PERMISSION.VIEW_USERS, item.id)]}
                href={`/users/${item.id}`}
                label={item.name}
              />
            </li>
          ))
        }
      </ul>
    ),
  },
  {
    title: 'Clients',
    dataIndex: 'clients',
    render: (data) => data.map((item, idx) => (
      <GuardedLink
        key={idx.toString()}
        gates={[PERMISSION.VIEW_CLIENTS, wildcard(PERMISSION.VIEW_CLIENTS, item.id)]}
        href={`/clients/${item.id}`}
        label={item.name}
      />
    )),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    // eslint-disable-next-line react/display-name
    render: (status) => <Badge text={status} status={STATUS_COLORS[status]} className={styles.status} />,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
  },
];

const Projects = () => {
  const dispatch = useDispatch();
  const [projects, total, loading] = useSelector(projectsSelector);
  const [pagination, paginationOptions] = usePagination();

  useEffect(() => {
    dispatch(fetchProjects(pagination));
  }, [dispatch, pagination]);

  return (
    <>
      <div className={styles.buttons}>
        <Button type='primary'>
          <Link href='/projects/new'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Add</a>
          </Link>
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={projects}
        columns={COLUMNS}
        scroll={{ x: 600 }}
        pagination={{
          total,
          ...paginationOptions,
        }}
      />
    </>
  );
};

export default Projects;
