import { useCallback, useMemo } from 'react';
import {
  Card, Col, Progress, Skeleton,
} from 'antd';
import { useSelector } from 'react-redux';
import { HourglassTwoTone } from '@ant-design/icons';

import styles from './Time.module.scss';
import CardTitle from '../../../common/CardTitle';
import { HOURS_CAP, PROGRESS_CARD_STYLE } from '../../../../utils/constants';
import { projectSelector } from '../../../../store/projects/selectors';

const Time = () => {
  const [project, loading] = useSelector(projectSelector);

  const monthlyProgressFormat = useCallback(
    () => `${(project.totals?.worktime_this_month || 0).toFixed(1)}/${HOURS_CAP} h`,
    [project],
  );

  const monthlyHoursPercent = useMemo(() => (project.worktime_this_month * 100) / HOURS_CAP, [project]);

  return (
    <>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD_STYLE}
          className={styles.card}
          title={(
            typeof project.totals?.worktime_this_month === 'number' && (
              <CardTitle
                title={project.totals?.worktime_this_month}
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
              status={project.totals?.worktime_this_month >= HOURS_CAP ? 'normal' : 'active'}
              format={monthlyProgressFormat}
              success={{ percent: monthlyHoursPercent > 100 ? monthlyHoursPercent - 100 : 0, strokeColor: '#48fdb3' }}
              style={{ width: '87%' }}
            />
          </Skeleton>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD_STYLE}
          className={styles.card}
          title={(
            typeof project.totals?.total_worktime === 'number' && (
              <CardTitle
                title={project.totals?.total_worktime}
                icon={<HourglassTwoTone twoToneColor='#12c2e9' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Total Worktime</span>
          </Skeleton>
        </Card>
      </Col>
    </>
  );
};

export default Time;
