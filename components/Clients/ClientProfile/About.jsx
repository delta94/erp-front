import {
  Card, Col, Skeleton, Typography,
} from 'antd';
import {
  HomeOutlined, LinkOutlined, MailOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

import styles from '../Clients.module.scss';
import { clientSelector } from '../../../store/clients/selectors';

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

const About = () => {
  const [client, loading] = useSelector(clientSelector);

  return (
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
  );
};

export default About;
