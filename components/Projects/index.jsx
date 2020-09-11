import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Button, Badge,
} from 'antd';
import Link from 'next/link';

import styles from './Projects.module.scss';
import { projectsSelector } from '../../store/projects/selectors';
import { fetchProjects } from '../../store/projects/actions';
import { STATUS_COLORS } from '../../utils/constants';
import usePagination from '../../utils/hooks/usePagination';

const COLUMNS = [
  {
    title: 'Title',
    dataIndex: 'title',
    // eslint-disable-next-line jsx-a11y/anchor-is-valid,react/display-name
    render: (text, { id }) => <Link href='/projects/[id]' as={`/projects/${id}`}><a>{text}</a></Link>,
  },
  {
    title: 'Developers',
    dataIndex: 'developers',
    render: (data) => data.map((item, idx) => (
      <Link key={idx.toString()} href='/users/[id]' as={`/users/${item.id}`}>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a>{item.name}</a>
      </Link>
    )),
  },
  {
    title: 'Managers',
    dataIndex: 'managers',
    render: (data) => data.map((item, idx) => (
      <Link key={idx.toString()} href='/users/[id]' as={`/users/${item.id}`}>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a>{item.name}</a>
      </Link>
    )),
  },
  {
    title: 'Clients',
    dataIndex: 'clients',
    render: (data) => data.map((item, idx) => (
      <Link key={idx.toString()} href='/clients/[id]' as={`/clients/${item.id}`}>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a>{item.name}</a>
      </Link>
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
  {
    title: 'Starting At',
    dataIndex: 'start_date',
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
