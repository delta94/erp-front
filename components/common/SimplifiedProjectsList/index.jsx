import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Badge, Table } from 'antd';

import styles from './SimplifiedProjectsList.module.scss';
import { STATUS_COLORS } from '../../../utils/constants';

const COLUMNS = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (title, { id, status }) => (
      <span>
        <Badge status={STATUS_COLORS[status]} className={styles.badge} />
        <Link href='/projects/[id]' as={`/projects/${id}`}>
          <a>{ title }</a>
        </Link>
      </span>
    ),
  },
  {
    title: 'Total Worked (hrs)',
    dataIndex: 'total_worked',
  },
  {
    title: 'This Month (hrs)',
    dataIndex: 'worked_this_month',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    render: (rate, { salary_based: salaryBased }) => `$ ${new Intl.NumberFormat().format(rate)} ${salaryBased ? 'monthly' : 'hourly'}`,
  },
];

const SimplifiedProjectsList = ({ data }) => (
  <Table
    dataSource={data.map((item) => ({ ...item, key: item.id }))}
    columns={COLUMNS}
    size='small'
    pagination={false}
    className={styles.table}
    showHeader={!!data.length}
  />
);

SimplifiedProjectsList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SimplifiedProjectsList;
