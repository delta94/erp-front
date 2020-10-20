import { useEffect, useMemo } from 'react';
import {
  Avatar, Table, Tag, Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Team.module.scss';
import usePagination from '../../../../utils/hooks/usePagination';
import EntityAccessMiddleware from '../../../common/EntityAccessMiddleware';
import {
  PERMISSION, RESPONSE_MODE, USER_ROLE, USER_ROLE_COLORS,
} from '../../../../utils/constants';
import { signedUserSelector } from '../../../../store/auth/selectors';
import { clearProjectSubState, fetchProjectUsers } from '../../../../store/projects/actions';
import { projectUsersSelector } from '../../../../store/projects/selectors';
import GuardedLink from '../../../common/GuardedLink';
import { wildcard } from '../../../../utils';

const COLUMNS = {
  NAME: {
    title: 'Name',
    dataIndex: 'name',
    render: (data, record) => (
      <div className={styles.avatarWrap}>
        <Avatar size={25} src={record.avatar?.url}>Pr</Avatar>
        <GuardedLink
          href='/users/[id]'
          as={`/users/${record.id}`}
          gate={wildcard(PERMISSION.VIEW_USERS, record.id)}
        >
          <span className={styles.name}>
            { data }
          </span>
        </GuardedLink>
      </div>
    ),
  },
  ROLE: {
    title: 'Role',
    dataIndex: ['pivot', 'role'],
    render: (role) => (
      <Tag color={USER_ROLE_COLORS[role] || 'default'}>{role}</Tag>
    ),
  },
  STARTED_FROM: {
    title: 'Start date',
    dataIndex: ['pivot', 'start_date'],
  },
};

const MAP = {
  [USER_ROLE.ADMIN]: Object.values(COLUMNS),
  [USER_ROLE.MANAGER]: [COLUMNS.NAME, COLUMNS.STARTING_FROM, COLUMNS.PROJECT],
};

const ProjectTeam = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [users, total, loading, , response] = useSelector(projectUsersSelector);
  const [pagination, paginationOptions] = usePagination();
  const [signedUser] = useSelector(signedUserSelector);

  const columns = useMemo(() => {
    const keys = Object.keys(MAP);
    for (let i = 0; i < keys.length; i += 1) {
      if (signedUser?.roles?.includes(keys[i])) return MAP[keys[i]];
    }
    return [];
  }, [signedUser]);

  useEffect(() => {
    if (query.id) {
      dispatch(fetchProjectUsers(query.id, {
        ...pagination,
        mode: RESPONSE_MODE.SIMPLIFIED,
        with: ['pivot', 'avatar'],
      }));
    }
    return () => dispatch(clearProjectSubState('users'));
  }, [dispatch, query, pagination]);

  return (
    <EntityAccessMiddleware entityName='raises' mode='simple' loading={loading} response={response}>
      <Table
        size='small'
        loading={loading}
        dataSource={users}
        columns={columns}
        scroll={{ x: 600 }}
        className={styles.table}
        showHeader={!!users.length}
        pagination={{
          total,
          size: 'small',
          ...paginationOptions,
        }}
      />
    </EntityAccessMiddleware>
  );
};

export default ProjectTeam;
