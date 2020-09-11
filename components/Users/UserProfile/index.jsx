/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useCallback } from 'react';
import {
  PageHeader, Row, Col, Card, Avatar, Typography, Tag, Skeleton, Result, Button, Tabs, Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  ProjectOutlined, DollarOutlined, ToTopOutlined, MailOutlined, ClockCircleOutlined,
} from '@ant-design/icons';

import styles from './UserProfile.module.scss';
import Profits from './Profits';
import UserRaises from './Raises';
import UserProjects from './Projects';
import UserPayments from './Payments';
import UserCalendar from './Calendar';
import UserWorktime from './Worktime';
import { fetchUser } from '../../../store/users/actions';
import { userCalendarSelector, userSelector } from '../../../store/users/selectors';
import { USER_ROLE_COLORS, USER_STATUS_COLORS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils';

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

const TABS = [
  {
    title: 'Projects',
    icon: ProjectOutlined,
    component: UserProjects,
  },
  {
    title: 'Payments',
    icon: DollarOutlined,
    component: UserPayments,
  },
  {
    title: 'Raises',
    icon: ToTopOutlined,
    component: UserRaises,
  },
  {
    title: 'Worktime',
    icon: ClockCircleOutlined,
    component: UserWorktime,
  },
];

const UserProfile = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const [user, loading, isFound] = useSelector(userSelector);

  useEffect(() => {
    if (query.id) dispatch(fetchUser(query.id));
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
                <Typography.Text className={styles.description} copyable>
                  <Tooltip title='Rate'><DollarOutlined /></Tooltip>
                  { formatCurrency(user.rate) }
                </Typography.Text>
                <Typography.Link href={`mailto:${user.email}`} className={styles.description} copyable>
                  <Tooltip title='Email'><MailOutlined /></Tooltip>
                  { user.email }
                </Typography.Link>
              </Skeleton>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className={styles.block}
              {...CARD_STYLE}
            >
              <Skeleton loading={loading} active>
                <UserCalendar />
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Profits />
          <Col span={24}>
            <Card className={styles.block} {...CARD_STYLE}>
              <Skeleton loading={loading} active>
                <Tabs>
                  {TABS.map(renderTab)}
                </Tabs>
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  ), [user, renderTab, loading]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='User Profile'
        subTitle={user.name}
        onBack={back}
        extra={[
          <Button key={0} type='primary'>Edit</Button>,
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
