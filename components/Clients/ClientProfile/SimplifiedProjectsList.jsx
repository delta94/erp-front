import React, { useCallback } from 'react';
import Link from 'next/link';
import { Badge, List } from 'antd';
import { useSelector } from 'react-redux';

import styles from '../Clients.module.scss';
import { clientSelector } from '../../../store/clients/selectors';
import { STATUS_COLORS } from '../../../utils/constants';

const SimplifiedProjectsList = () => {
  const [client] = useSelector(clientSelector);

  const renderItem = useCallback((item, idx) => (
    <List.Item key={idx}>
      <span>
        <Badge status={STATUS_COLORS[item.status]} className={styles.badge} />
        <Link href='/projects/[id]' as={`/projects/${item.id}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>{ item.title }</a>
        </Link>
      </span>
    </List.Item>
  ), []);

  return (
    <List itemLayout='horizontal' dataSource={client?.projects} renderItem={renderItem} />
  );
};

export default SimplifiedProjectsList;
