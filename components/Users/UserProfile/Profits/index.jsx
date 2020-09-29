import { useCallback, useMemo } from 'react';
import {
  Card, Col, Progress, Skeleton,
} from 'antd';
import { useSelector } from 'react-redux';
import { DollarCircleTwoTone } from '@ant-design/icons';

import styles from './Profits.module.scss';
import CardTitle from '../../../common/CardTitle';
import { userSelector } from '../../../../store/users/selectors';
import { HOURS_CAP } from '../../../../utils/constants';
import { formatCurrency } from '../../../../utils';

const PROGRESS_CARD = {
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

const Profits = () => {
  const [user, loading] = useSelector(userSelector);

  const progressFormat = useCallback(
    (percent) => `${((percent * HOURS_CAP) / 100).toFixed(1)}/${HOURS_CAP} h`,
    [],
  );

  const salaryFormat = useCallback(() => `${user.salary_this_month}/${user.rate} $`, [user]);

  const hoursPercent = useMemo(() => (user.worktime_this_month * 100) / HOURS_CAP, [user]);

  const salaryPercent = useMemo(() => (user.salary_this_month * 100) / user?.rate, [user]);

  return (
    <>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD}
          className={styles.card}
          title={(
            typeof user.earned_this_month === 'number' && (
              <CardTitle
                title={formatCurrency(user.earned_this_month)}
                icon={<DollarCircleTwoTone twoToneColor='#87d068' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Earned this month</span>
            <Progress
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
              percent={hoursPercent}
              status='active'
              format={progressFormat}
              success={{ percent: hoursPercent > 100 ? hoursPercent - 100 : 0 }}
              style={{ width: '87%' }}
            />
          </Skeleton>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD}
          className={styles.card}
          title={(
            typeof user.salary_this_month === 'number' && (
              <CardTitle
                title={formatCurrency(user.salary_this_month)}
                icon={<DollarCircleTwoTone twoToneColor='#12c2e9' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Salary this month</span>
            <Progress
              strokeColor={{
                0: '#f64f59',
                50: '#c471ed',
                100: '#12c2e9',
              }}
              percent={salaryPercent}
              status='active'
              format={salaryFormat}
              success={{ percent: salaryPercent > 100 ? salaryPercent - 100 : 0 }}
              style={{ width: '87%' }}
            />
          </Skeleton>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD}
          className={styles.card}
          title={(
            typeof user.total_earned === 'number' && (
              <CardTitle
                title={formatCurrency(user.total_earned)}
                icon={<DollarCircleTwoTone twoToneColor='#87d068' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Total Earnings</span>
          </Skeleton>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD}
          className={styles.card}
          title={(
            typeof (user.salary_all_time) === 'number' && (
              <CardTitle
                title={formatCurrency(user.salary_all_time)}
                icon={<DollarCircleTwoTone twoToneColor='#12c2e9' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Salary all time</span>
          </Skeleton>
        </Card>
      </Col>
    </>
  );
};

export default Profits;
