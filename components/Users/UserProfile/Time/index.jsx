import { useCallback, useMemo } from 'react';
import {
  Card, Col, Progress, Skeleton,
} from 'antd';
import { useSelector } from 'react-redux';
import { HourglassTwoTone } from '@ant-design/icons';

import styles from './Time.module.scss';
import CardTitle from '../../../common/CardTitle';
import { userSelector } from '../../../../store/users/selectors';
import { HOURS_CAP } from '../../../../utils/constants';

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

const Time = () => {
  const [user, loading] = useSelector(userSelector);

  const weeklyProgressFormat = useCallback(
    () => `${(user.worktime_this_week || 0).toFixed(1)}/${40} h`,
    [user],
  );

  const monthlyProgressFormat = useCallback(
    () => `${(user.worktime_this_month || 0).toFixed(1)}/${HOURS_CAP} h`,
    [user],
  );

  const monthlyHoursPercent = useMemo(() => (user.worktime_this_month * 100) / HOURS_CAP, [user]);

  const weeklyHoursPercent = useMemo(() => (user.worktime_this_week * 100) / 40, [user]);

  return (
    <>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD}
          className={styles.card}
          title={(
            typeof user.worktime_this_month === 'number' && (
              <CardTitle
                title={user.worktime_this_month}
                subTitle=' h'
                icon={<HourglassTwoTone twoToneColor='#87d068' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Worktime this month</span>
            <Progress
              strokeColor={{
                from: '#0f3443',
                to: '#34e89e',
              }}
              percent={monthlyHoursPercent}
              status={user.worktime_this_month >= HOURS_CAP ? 'normal' : 'active'}
              format={monthlyProgressFormat}
              success={{ percent: monthlyHoursPercent > 100 ? monthlyHoursPercent - 100 : 0, strokeColor: '#48fdb3' }}
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
            typeof user.worktime_this_week === 'number' && (
              <CardTitle
                title={user.worktime_this_week}
                subTitle=' h'
                icon={<HourglassTwoTone twoToneColor='#12c2e9' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Worktime this week</span>
            <Progress
              strokeColor={{
                from: '#2C3E50',
                to: '#4CA1AF',
              }}
              percent={weeklyHoursPercent}
              status={user.worktime_this_week >= 40 ? 'normal' : 'active'}
              format={weeklyProgressFormat}
              success={{ percent: weeklyHoursPercent > 100 ? weeklyHoursPercent - 100 : 0, strokeColor: '#68c9db' }}
              style={{ width: '87%' }}
            />
          </Skeleton>
        </Card>
      </Col>
    </>
  );
};

export default Time;
