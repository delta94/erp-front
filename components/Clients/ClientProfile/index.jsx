import { useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  PageHeader, Row, Col, Card, Avatar, Typography, Tag, Skeleton, Result, Empty, Button, Tabs,
} from 'antd';
import {
  ShareAltOutlined, ProjectOutlined, ScheduleOutlined, LinkedinOutlined, RedditOutlined,
} from '@ant-design/icons';

import styles from '../Clients.module.scss';
import SimplifiedProjectsList from '../../common/SimplifiedProjectsList';
import Can from '../../common/Can';
import About from './About';
import { fetchClient } from '../../../store/clients/actions';
import { clientSelector } from '../../../store/clients/selectors';
import { ORIGIN_COLORS, PERMISSION } from '../../../utils/constants';
import { wildcard } from '../../../utils';
import GuardedLink from '../../common/GuardedLink';

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
    // eslint-disable-next-line react/prop-types
    component: ({ client }) => <SimplifiedProjectsList data={client.projects || []} />,
  },
  {
    title: 'Invoices',
    icon: ScheduleOutlined,
    component: () => 'tab 2',
  },
];

// eslint-disable-next-line react/prop-types
const Loader = ({ spanSize = 12 }) => (
  <Col span={spanSize}>
    <Card className={styles.block} {...CARD_STYLE}>
      <Skeleton loading active className={styles.fullWidth} />
    </Card>
  </Col>
);

const getIconForLink = (type) => {
  switch (type) {
    case 'linkedin': return <LinkedinOutlined />;
    case 'reddit': return <RedditOutlined />;
    default: return <ShareAltOutlined />;
  }
};

const ClientProfile = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const [client, loading, isFound] = useSelector(clientSelector);

  useEffect(() => {
    if (query.id) dispatch(fetchClient(query.id));
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
      <tab.component client={client} />
    </Tabs.TabPane>
  ), [client]);

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
                  <Avatar size={50} src={client.avatar?.url}>U</Avatar>
                  <Typography.Text strong className={styles.name}>
                    { client?.name }
                    <br />
                    <Tag color={ORIGIN_COLORS[client?.origin] || 'cyan'}>{ client?.origin }</Tag>
                  </Typography.Text>
                </div>
              </Skeleton>
            </Card>
          </Col>
          <Can
            perform={wildcard(PERMISSION.VIEW_CLIENT_ABOUT)}
            yes={<About />}
            loading={<Loader />}
          />
          <Col span={24}>
            <Card
              className={styles.block}
              title='Links'
              {...CARD_STYLE}
            >
              <Skeleton loading={loading} active>
                {
                  !client.links?.length
                    ? <Empty description={false} />
                    : client.links.map((link, idx) => (
                      <Typography.Link
                        key={idx.toString()}
                        href={`https://${link.value}`}
                        className={styles.description}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        { getIconForLink(link.type) }
                        { link.value }
                      </Typography.Link>
                    ))
                }
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={16}>
        <Row gutter={[16, 16]}>
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
  ), [client, renderTab, loading]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Client Profile'
        subTitle={client?.name}
        onBack={back}
        extra={[
          <GuardedLink
            key={0}
            gate={{ any: [wildcard(PERMISSION.EDIT_CLIENTS, client.id)] }}
            href='/clients/[id]/edit'
            as={`/clients/${client.id}/edit`}
          >
            <Button type='primary'>Edit</Button>
          </GuardedLink>,
        ]}
      />
      {
        !isFound && !loading
          ? <Result status='404' title='Not Found' subTitle='Sorry, such client does not exist.' />
          : content
      }
    </>
  );
};

export default ClientProfile;
