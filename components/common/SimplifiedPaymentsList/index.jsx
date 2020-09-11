import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Badge, Table, Tag } from 'antd';

import styles from './SimplifiedPaymentsList.module.scss';
import { ORIGIN_COLORS, PAYMENT_STATUS_COLORS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils';

const COLUMNS = [
  {
    title: 'From',
    dataIndex: 'client',
    render: (item) => (
      <Link href='/clients/[id]' as={`/clients/${item.id}`}>
        <a>{ item.name }</a>
      </Link>
    ),
  },
  {
    title: 'Account',
    dataIndex: 'account',
    render: (item) => <Tag color={ORIGIN_COLORS[item.type]}>{ item.type }</Tag>,
  },
  {
    title: 'Purpose',
    dataIndex: 'purpose',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (amount) => formatCurrency(amount),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => <Badge status={PAYMENT_STATUS_COLORS[status]} text={status} />,
  },
];

const SimplifiedPaymentsList = ({ data }) => (
  <Table
    dataSource={data.map((item) => ({ ...item, key: item.id }))}
    columns={COLUMNS}
    size='small'
    pagination={false}
    className={styles.table}
    showHeader={!!data.length}
  />
);

SimplifiedPaymentsList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SimplifiedPaymentsList;
