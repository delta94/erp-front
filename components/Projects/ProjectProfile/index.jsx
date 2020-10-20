import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar, Button, Card, Col, PageHeader, Row, Skeleton, Tabs, Tag, Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClockCircleOutlined, DollarOutlined, TeamOutlined, ToTopOutlined,
} from '@ant-design/icons';

import styles from '../Projects.module.scss';
import GuardedLink from '../../common/GuardedLink';
import EntityAccessMiddleware from '../../common/EntityAccessMiddleware';
import Can from '../../common/Can';
import SuspenseLoader from '../../common/SuspenseLoader';
import ProjectPayments from './Payments';
import ProjectRaises from './Raises';
import ProjectWorktime from './Worktime';
import ProjectTeam from './Team';
import Profits from './Profits';
import Time from './Time';
import { wildcard } from '../../../utils';
import { projectSelector } from '../../../store/projects/selectors';
import { fetchProject } from '../../../store/projects/actions';
import { signedUserSelector } from '../../../store/auth/selectors';
import {
  CARD_STYLE,
  ORIGIN_COLORS,
  PERMISSION,
  USER_ROLE,
} from '../../../utils/constants';

const Loader = ({ spanSize = 12 }) => (
  <Col span={spanSize}>
    <Card className={styles.block} {...CARD_STYLE}>
      <Skeleton loading active className={styles.fullWidth} />
    </Card>
  </Col>
);

const TABS = {
  PAYMENTS: {
    title: 'Payments',
    icon: DollarOutlined,
    component: ProjectPayments,
  },
  USERS: {
    title: 'Team',
    icon: TeamOutlined,
    component: ProjectTeam,
  },
};

const MAP = {
  [USER_ROLE.ADMIN]: Object.values(TABS),
  [USER_ROLE.MANAGER]: [TABS.USERS],
};

const ProjectProfile = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const [signedUser] = useSelector(signedUserSelector);
  const [project, loading, response] = useSelector(projectSelector);

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

  const tabs = useMemo(() => {
    const keys = Object.keys(MAP);
    for (let i = 0; i < keys.length; i += 1) {
      if (signedUser?.roles?.includes(keys[i])) return MAP[keys[i]].map(renderTab);
    }
    return null;
  }, [signedUser, renderTab]);

  useEffect(() => {
    if (query.id) dispatch(fetchProject(query.id, { with: ['totals'] }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Project'
        subTitle={project.title}
        onBack={back}
        extra={[
          <SuspenseLoader loading={loading} key={0}>
            <GuardedLink
              gate={{ any: [wildcard(PERMISSION.EDIT_PROJECTS, project.id)] }}
              href='/projects/[id]/edit'
              as={`/projects/${project.id}/edit`}
            >
              <Button type='primary'>Edit</Button>
            </GuardedLink>
          </SuspenseLoader>,
        ]}
      />
      <EntityAccessMiddleware response={response} loading={loading} entityName='project'>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  className={styles.block}
                  title='Project Details'
                  {...CARD_STYLE}
                  bodyStyle={{ ...CARD_STYLE.bodyStyle, flexDirection: 'row' }}
                >
                  <Skeleton loading={loading} avatar active>
                    <div className={styles.avatarWrap}>
                      <Avatar size={50} shape='square' src={project.avatar?.url}>Pr</Avatar>
                      <Typography.Text strong className={styles.name}>
                        { project.title }
                        <br />
                        { project.tags?.map((tag, idx) => (
                          <Tag key={idx.toString()} color={tag.color}>{ tag.name }</Tag>
                        )) }
                      </Typography.Text>
                    </div>
                  </Skeleton>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  className={styles.block}
                  title='Client'
                  {...CARD_STYLE}
                  bodyStyle={{ ...CARD_STYLE.bodyStyle, flexDirection: 'row' }}
                >
                  <Skeleton loading={loading} avatar active>
                    <div className={styles.avatarWrap}>
                      <Avatar size={50} src={project.client?.avatar?.url}>U</Avatar>
                      <Typography.Text strong className={styles.name}>
                        <GuardedLink
                          href='/clients/[id]'
                          as={`/clients/${project.client?.id}`}
                          gate={wildcard(PERMISSION.VIEW_USERS, project.client?.id)}
                        >
                          { project.client?.name }
                        </GuardedLink>
                        <br />
                        <Tag color={ORIGIN_COLORS[project.client?.origin] || 'cyan'}>{ project.client?.origin }</Tag>
                      </Typography.Text>
                    </div>
                  </Skeleton>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Can
                perform={wildcard(PERMISSION.VIEW_PROJECT_PROFITS, project.id)}
                yes={<Profits />}
                loading={<Loader />}
              />
              <Can
                perform={wildcard(PERMISSION.VIEW_PROJECT_WORKTIME, project.id)}
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
      </EntityAccessMiddleware>
    </>
  );
};

export default ProjectProfile;
