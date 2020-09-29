/* eslint-disable react/prop-types */
import { useEffect, useMemo, useCallback } from 'react';
import {
  PageHeader, Row, Col, Card, Avatar, Typography, Tag, Skeleton, Result, Button, Tabs, Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  ProjectOutlined, DollarOutlined, ToTopOutlined, MailOutlined, ClockCircleOutlined,
} from '@ant-design/icons';

import styles from './UserProfile.module.scss';
import Can from '../../common/Can';
import Profits from './Profits';
import Time from './Time';
import UserRaises from './Raises';
import UserProjects from './Projects';
import UserPayments from './Payments';
import UserCalendar from './Calendar';
import UserWorktime from './Worktime';
import { fetchUser, clearUser } from '../../../store/users/actions';
import { userSelector } from '../../../store/users/selectors';
import { formatCurrency, wildcard } from '../../../utils';
import { accountSelector } from '../../../store/auth/selectors';
import {
  USER_ROLE, USER_ROLE_COLORS, USER_STATUS_COLORS, PERMISSION,
} from '../../../utils/constants';

const CARD_STYLE = {
  headStyle: {
    borderBottom: 'none',
    padding: '0 12px',
  },
  bodyStyle: {
    padding: '0 12px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
};

const TABS = {
  PROJECTS: {
    title: 'Projects',
    icon: ProjectOutlined,
    component: UserProjects,
  },
  PAYMENTS: {
    title: 'Payments',
    icon: DollarOutlined,
    component: UserPayments,
  },
  RAISES: {
    title: 'Raises',
    icon: ToTopOutlined,
    component: UserRaises,
  },
  WORKTIME: {
    title: 'Worktime',
    icon: ClockCircleOutlined,
    component: UserWorktime,
  },
};

const MAP = {
  [USER_ROLE.ADMIN]: Object.values(TABS),
  [USER_ROLE.MANAGER]: [TABS.PROJECTS, TABS.RAISES, TABS.WORKTIME],
};

const Loader = ({ spanSize = 12 }) => (
  <Col span={spanSize}>
    <Card className={styles.block} {...CARD_STYLE}>
      <Skeleton loading active className={styles.fullWidth} />
    </Card>
  </Col>
);

const UserProfile = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const [account] = useSelector(accountSelector);
  const [user, loading, isFound] = useSelector(userSelector);

  useEffect(() => {
    if (query.id) dispatch(fetchUser(query.id));

    return () => dispatch(clearUser());
  }, [dispatch, query]);

  const renderTab = useCallback((tab, idx) => (
    <Tabs.TabPane
      key={idx}
      tab={(
        <span>
          <tab.icon />
          { tab.title }
        </span>
      )}
    >
      <tab.component />
    </Tabs.TabPane>
  ), []);

  const tabs = useMemo(() => (MAP[account?.role] || []).map(renderTab), [account, renderTab]);

  const content = useMemo(() => (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              className={styles.block}
              title='Profile Details'
              {...CARD_STYLE}
              bodyStyle={{ ...CARD_STYLE.bodyStyle, flexDirection: 'row' }}
            >
              <Skeleton loading={loading} avatar active>
                <div className={styles.avatarWrap}>
                  <Avatar size={50} src={user.avatar?.url}>U</Avatar>
                  <Typography.Text strong className={styles.name}>
                    { user.name }
                    <br />
                    <Tag color={USER_ROLE_COLORS[user.role] || 'cyan'}>{ user.role }</Tag>
                    <Tag color={USER_STATUS_COLORS[user.status] || 'default'}>{ user.status }</Tag>
                  </Typography.Text>
                </div>
              </Skeleton>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className={styles.block}
              title='About'
              {...CARD_STYLE}
            >
              <Skeleton loading={loading} active>
                <Can
                  perform='rate:view'
                  yes={(
                    <Typography.Text className={styles.description} copyable>
                      <Tooltip title='Rate'><DollarOutlined /></Tooltip>
                      { formatCurrency(user.rate) }
                    </Typography.Text>
                  )}
                />
                <Typography.Link href={`mailto:${user.email}`} className={styles.description} copyable>
                  <Tooltip title='Email'><MailOutlined /></Tooltip>
                  { user.email }
                </Typography.Link>
              </Skeleton>
            </Card>
          </Col>
          <Col span={24}>
            <Can
              perform={wildcard(PERMISSION.VIEW_USER_WORKTIME, user.id)}
              yes={(
                <Card
                  className={styles.block}
                  {...CARD_STYLE}
                >
                  <Skeleton loading={loading} active>
                    <UserCalendar />
                  </Skeleton>
                </Card>
              )}
              loading={<Loader spanSize={24} />}
            />
          </Col>
        </Row>
      </Col>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Can
            perform={wildcard(PERMISSION.VIEW_USER_PROFITS, user.id)}
            yes={<Profits />}
            loading={<Loader />}
          />
          <Can
            perform={wildcard(PERMISSION.VIEW_USER_WORKTIME, user.id)}
            yes={<Time />}
            loading={<Loader />}
          />
          <Col span={24}>
            <Card className={styles.block} {...CARD_STYLE}>
              <Skeleton loading={loading} active>
                <Tabs>
                  {tabs}
                </Tabs>
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  ), [user, tabs, loading]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='User Profile'
        subTitle={user.name}
        onBack={back}
        extra={[
          <Can key={0} perform='users:edit' yes={<Button key={0} type='primary'>Edit</Button>} />,
        ]}
      />
      {
        !isFound && !loading
          ? <Result status='404' title='Not Found' subTitle='Sorry, such user does not exist.' />
          : content
      }
    </>
  );
};

export default UserProfile;
