import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Empty, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusOutlined } from '@ant-design/icons';

import styles from './Raises.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import { RESPONSE_MODE, STATUS_COLORS, USER_ROLE } from '../../../../utils/constants';
import { clearUserSubState, fetchUserRaises } from '../../../../store/users/actions';
import { userRaisesSelector } from '../../../../store/users/selectors';
import { formatCurrency } from '../../../../utils';
import { signedUserSelector } from '../../../../store/auth/selectors';

const COLUMNS = {
  TYPE: {
    title: 'Type',
    dataIndex: 'type',
  },
  AMOUNT: {
    title: 'Amount',
    dataIndex: 'amount',
    render: (amount) => formatCurrency(amount),
  },
  STARTING_FROM: {
    title: 'Starting From',
    dataIndex: 'starting_from',
  },
  PROJECT: {
    title: 'Project',
    dataIndex: 'project',
    render: (project) => (project ? (
      <span>
        <Badge status={STATUS_COLORS[project.status]} className={styles.badge} />
        <Link href='/projects/[id]' as={`/projects/${project.id}`}>
          <a>{project.title}</a>
        </Link>
      </span>
    ) : (<MinusOutlined />)),
  },
};

const MAP = {
  [USER_ROLE.ADMIN]: Object.values(COLUMNS),
  [USER_ROLE.MANAGER]: [COLUMNS.AMOUNT, COLUMNS.STARTING_FROM, COLUMNS.PROJECT],
};

const UserRaises = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [projects, total, loading, , forbidden] = useSelector(userRaisesSelector);
  const [pagination, paginationOptions] = usePagination();
  const [user] = useSelector(signedUserSelector);

  const columns = useMemo(() => MAP[user?.role], [user]);

  useEffect(() => {
    if (query.id) {
      dispatch(fetchUserRaises(query.id, {
        ...pagination,
        mode: RESPONSE_MODE.SIMPLIFIED,
      }));
    }
    return () => dispatch(clearUserSubState('raises'));
  }, [dispatch, query, pagination]);

  return forbidden
    ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Access' />
    )
    : (
      <Table
        size='small'
        loading={loading}
        dataSource={projects}
        columns={columns}
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
