import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag } from 'antd';
import Link from 'next/link';

import styles from './Projects.module.scss';
import { projectsSelector } from '../../store/projects/selectors';
import { fetchProjects } from '../../store/projects/actions';

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Developers',
    dataIndex: 'developers',
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    render: (data) => data.map((item, idx) => (<a key={idx.toString()}>{item.name}</a>)),
  },
  {
    title: 'Managers',
    dataIndex: 'managers',
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    render: (data) => data.map((item, idx) => (<a key={idx.toString()}>{item.name}</a>)),
  },
  {
    title: 'Clients',
    dataIndex: 'clients',
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    render: (data) => data.map((item, idx) => (<a key={idx.toString()}>{item.name}</a>)),
  },
  {
    title: 'Salary Based',
    dataIndex: 'is_salary_based',
    render: (val) => (val ? 'Yes' : 'No'),
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    // eslint-disable-next-line react/display-name
    render: (tags) => (
      <>
        {tags.map((tag, idx) => <Tag key={idx.toString()} color={tag.color}>{tag.name}</Tag>)}
      </>
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
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

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

export default Projects;
