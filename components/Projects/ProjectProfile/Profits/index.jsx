import { useCallback, useMemo } from 'react';
import {
  Card, Col, Progress, Skeleton,
} from 'antd';
import { useSelector } from 'react-redux';
import { DollarCircleTwoTone } from '@ant-design/icons';

import styles from './Profits.module.scss';
import CardTitle from '../../../common/CardTitle';
import { HOURS_CAP, PROGRESS_CARD_STYLE } from '../../../../utils/constants';
import { formatCurrency } from '../../../../utils';
import { projectSelector } from '../../../../store/projects/selectors';

const ProjectProfits = () => {
  const [project, loading] = useSelector(projectSelector);

  const progressFormat = useCallback(
    (percent) => `${((percent * HOURS_CAP) / 100).toFixed(1)}/${HOURS_CAP} h`,
    [],
  );

  const hoursPercent = useMemo(() => (project.totals?.worktime_this_month * 100) / HOURS_CAP, [project]);

  return (
    <>
      <Col span={12}>
        <Card
          {...PROGRESS_CARD_STYLE}
          className={styles.card}
          title={(
            typeof project.totals?.earned_this_month === 'number' && (
              <CardTitle
                title={formatCurrency(project.totals?.earned_this_month || 0)}
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
          {...PROGRESS_CARD_STYLE}
          className={styles.card}
          title={(
            typeof project.totals?.total_earned === 'number' && (
              <CardTitle
                title={formatCurrency(project.totals?.total_earned)}
                icon={<DollarCircleTwoTone twoToneColor='#12c2e9' className={styles.titleIcon} />}
              />
            )
          )}
        >
          <Skeleton loading={loading} active>
            <span className={styles.description}>Total Earnings</span>
          </Skeleton>
        </Card>
      </Col>
    </>
  );
};

export default ProjectProfits;
