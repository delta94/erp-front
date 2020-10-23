import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Button, Space, Tag, Popconfirm, message,
} from 'antd';
import { DeleteOutlined, EditOutlined, QuestionOutlined } from '@ant-design/icons';

import styles from './Raises.module.scss';
import Can from '../common/Can';
import usePagination from '../../utils/hooks/usePagination';
import useFilters from '../../utils/hooks/useFilters';
import GuardedLink from '../common/GuardedLink';
import SuspenseLoader from '../common/SuspenseLoader';
import { PERMISSION, RAISE_TYPE_DISPLAY, RESPONSE_MODE } from '../../utils/constants';
import { wildcard } from '../../utils';
import { raisesSelector } from '../../store/raises/selectors';
import { deleteRaise, fetchRaises } from '../../store/raises/actions';

const COLUMNS = [
  {
    title: 'Type',
    dataIndex: 'type',
    render: (type) => {
      const display = RAISE_TYPE_DISPLAY[type];
      const Icon = display.icon || QuestionOutlined;
      return (
        <Tag color={display.color || 'default'}>
          <Icon />
          &nbsp;
          {type}
        </Tag>
      );
    },
  },
  {
    title: 'Amount ($)',
    dataIndex: 'amount',
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
  {
    title: 'Starting From',
    dataIndex: 'starting_from',
  },
  {
    title: 'Actions',
    render: (v, record) => (
      <>
        <GuardedLink
          gate={wildcard(PERMISSION.EDIT_RAISES, record.id)}
          href='/raises/[id]/edit'
          as={`/raises/${record.id}/edit`}
          hideIfFailed
        >
          <Button type='link' icon={<EditOutlined />}>Edit</Button>
        </GuardedLink>
        <Can
          perform={wildcard(PERMISSION.DELETE_RAISES, record.id)}
          yes={(
            <Popconfirm title='Sure to delete?' onConfirm={() => record.handleDelete(record.id)}>
              <Button type='link' danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        />
      </>
    ),
  },
];

const Raises = () => {
  const dispatch = useDispatch();
  const [records, total, loading, filtersData] = useSelector(raisesSelector);
  const [pagination, paginationOptions] = usePagination();
  const [filters, sorting, filterOptions] = useFilters(COLUMNS, filtersData);

  const fetchData = useCallback(() => {
    dispatch(fetchRaises({
      ...pagination, filters, sorting, mode: RESPONSE_MODE.SIMPLIFIED,
    }));
  }, [dispatch, pagination, filters, sorting]);

  const handleDelete = useCallback(async (id) => {
    const { data, error } = await dispatch(deleteRaise(id));
    if (data) {
      message.success(data);
      fetchData();
    }
    if (error) message.error('Unable to delete raise');
  }, [dispatch, fetchData]);

  const dataSource = useMemo(
    () => records.map((item) => ({ ...item, handleDelete })),
    [records, handleDelete],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <SuspenseLoader loading={loading} className={styles.buttons}>
        <Space className={styles.buttons}>
          <GuardedLink
            gate={PERMISSION.ADD_RAISES}
            href='/raises/new'
            loading={loading}
            hideIfFailed
          >
            <Button type='primary'>Add</Button>
          </GuardedLink>
        </Space>
      </SuspenseLoader>
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={{
          total,
          ...paginationOptions,
        }}
        {...filterOptions}
      />
    </>
  );
};

export default Raises;
