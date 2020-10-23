import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusOutlined, QuestionOutlined } from '@ant-design/icons';

import styles from './Raises.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import EntityAccessMiddleware from '../../../common/EntityAccessMiddleware';
import { clearUserSubState, fetchUserRaises } from '../../../../store/users/actions';
import { userRaisesSelector } from '../../../../store/users/selectors';
import { formatCurrency } from '../../../../utils';
import { signedUserSelector } from '../../../../store/auth/selectors';
import {
  RAISE_TYPE_DISPLAY, RESPONSE_MODE, STATUS_COLORS, USER_ROLE,
} from '../../../../utils/constants';

const COLUMNS = {
  TYPE: {
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
  const [records, total, loading, , response] = useSelector(userRaisesSelector);
  const [pagination, paginationOptions] = usePagination();
  const [signedUser] = useSelector(signedUserSelector);

  const columns = useMemo(() => {
    for (let i = 0; i < signedUser?.roles?.length; i += 1) {
      if (MAP[signedUser.roles[i]]) return MAP[signedUser.roles[i]];
    }
    return [];
  }, [signedUser]);

  useEffect(() => {
    if (query.id) {
      dispatch(fetchUserRaises(query.id, {
        ...pagination,
        mode: RESPONSE_MODE.SIMPLIFIED,
      }));
    }
    return () => dispatch(clearUserSubState('raises'));
  }, [dispatch, query, pagination]);

  return (
    <EntityAccessMiddleware entityName='raises' mode='simple' loading={loading} response={response}>
      <Table
        size='small'
        loading={loading}
        dataSource={records}
        columns={columns}
        scroll={{ x: 600 }}
        className={styles.table}
        showHeader={!!records.length}
        pagination={{
          total,
          size: 'small',
          ...paginationOptions,
        }}
      />
    </EntityAccessMiddleware>
  );
};

export default UserRaises;
