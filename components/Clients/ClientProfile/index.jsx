import React, { useEffect, useMemo, useCallback } from 'react';
import {
  PageHeader, Row, Col, Card, Avatar, Typography, Tag, Skeleton, Result, Empty, Button, Tabs,
} from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  HomeOutlined, MailOutlined, PhoneOutlined, ShareAltOutlined, LinkOutlined, ProjectOutlined, ScheduleOutlined,
} from '@ant-design/icons';

import styles from '../Clients.module.scss';
import SimplifiedProjectsList from '../../common/SimplifiedProjectsList';
import { fetchClient } from '../../../store/clients/actions';
import { clientSelector } from '../../../store/clients/selectors';
import { ORIGIN_COLORS } from '../../../utils/constants';

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
          <Col span={24}>
            <Card
              className={styles.block}
              title='About'
              {...CARD_STYLE}
            >
              <Skeleton loading={loading} active>
                <Typography.Text className={styles.description} copyable>
                  <HomeOutlined />
                  { client.full_address }
                </Typography.Text>
                <Typography.Link href={`mailto:${client.email}`} className={styles.description} copyable>
                  <MailOutlined />
                  { client.email }
                </Typography.Link>
                { client.phone && (
                  <Typography.Link href={`tel:${client.phone}`} className={styles.description} copyable>
                    <PhoneOutlined />
                    { client.phone }
                  </Typography.Link>
                ) }
                { client.websites?.length ? client.websites.map((website, idx) => (
                  <Typography.Link
                    key={idx.toString()}
                    href={`https://${website}`}
                    className={styles.description}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <LinkOutlined />
                    { website }
                  </Typography.Link>
                )) : null}
              </Skeleton>
            </Card>
          </Col>
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
                        href={`https://${link}`}
                        className={styles.description}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ShareAltOutlined />
                        { link }
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
          <Button key={0} type='primary'>Edit</Button>,
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
