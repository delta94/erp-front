import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space } from 'antd';
import Link from 'next/link';

import styles from './Projects.module.scss';
import usePagination from '../../utils/hooks/usePagination';
import GuardedLink from '../common/GuardedLink';
import { projectsSelector } from '../../store/projects/selectors';
import { fetchProjects } from '../../store/projects/actions';
import { PERMISSION } from '../../utils/constants';
import { wildcard } from '../../utils';
import SuspenseLoader from '../common/SuspenseLoader';

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
                gate={{
                  any: [PERMISSION.VIEW_USERS, PERMISSION.VIEW_DEVELOPERS, wildcard(PERMISSION.VIEW_USERS, item.id)],
                }}
                href='/users/id'
                as={`/users/${item.id}`}
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
                gate={{
                  any: [PERMISSION.VIEW_USERS, PERMISSION.VIEW_MANAGERS, wildcard(PERMISSION.VIEW_USERS, item.id)],
                }}
                href='/users/[id]'
                as={`/users/${item.id}`}
                label={item.name}
              />
            </li>
          ))
        }
      </ul>
    ),
  },
  {
    title: 'Client',
    dataIndex: 'client',
    render: (item) => (
      <GuardedLink
        gate={{
          any: [PERMISSION.VIEW_CLIENTS, wildcard(PERMISSION.VIEW_CLIENTS, item.id)],
        }}
        href='/clients/[id]'
        as={`/clients/${item.id}`}
        label={item.name}
      />
    ),
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
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink href='/projects/new' gate={PERMISSION.ADD_PROJECTS} hideIfFailed>
            <Button type='primary'>
              Add
            </Button>
          </GuardedLink>
        </Space>
      </SuspenseLoader>
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
