import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Badge, Calendar as AntCalendar, Popconfirm, Popover, Button, Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { DeleteOutlined } from '@ant-design/icons';

import styles from './Calendar.module.scss';
import { deleteUserWorktime, fetchUser, fetchUserCalendar } from '../../../../store/users/actions';
import { RESPONSE_MODE } from '../../../../utils/constants';
import { userMappedCalendarSelector } from '../../../../store/users/selectors';
import AddWorktimeModal from '../../../common/AddWorktimeModal';

const TimeList = ({ data }) => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  const handleConfirm = useCallback((row) => {
    dispatch(deleteUserWorktime(query.id, row.id));
  }, [dispatch, query]);

  return (
    data.map((row, idx) => (
      <div key={idx.toString()} className={styles.timeList}>
        <span>
          <span className={styles.time}>{ row.time }</span>
          <Typography.Text ellispis>{ row.project.title }</Typography.Text>
        </span>
        <Popconfirm
          title='Delete time?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => handleConfirm(row)}
        >
          <Button type='link' title='Delete'><DeleteOutlined /></Button>
        </Popconfirm>
      </div>
    ))
  );
};

// eslint-disable-next-line react/prop-types
const Cell = ({ date, title, onConfirm = () => {} }) => (
  <Popconfirm
    title={title}
    cancelText='Close'
    okText='Add'
    trigger='click'
    icon={null}
    onConfirm={() => onConfirm(date)}
  >
    <span className={styles.cell}>
      {/* eslint-disable-next-line react/prop-types */}
      { date.format('DD') }
    </span>
  </Popconfirm>
);

const Calendar = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [date, setDate] = useState(moment());
  const [calendarData] = useSelector(userMappedCalendarSelector);
  const [modalVisible, toggleModal] = useState(false);

  const handleConfirm = useCallback(() => {
    toggleModal(true);
  }, []);

  const renderCell = useCallback((d) => {
    const data = calendarData[d.format('YYYY-MM-DD')];
    const time = data ? data.reduce((all, item) => all + item.time, 0) : 0;
    const cell = (
      <Cell
        title={<TimeList data={data || []} />}
        onConfirm={handleConfirm}
        date={d}
      />
    );
    return time
      ? (
        <Popover content={time}>
          <Badge dot offset={[0, -3]} style={{ zIndex: 3 }} color={time >= 8 ? 'green' : 'red'}>
            { cell }
          </Badge>
        </Popover>
      )
      : cell;
  }, [calendarData, handleConfirm]);

  const handleChange = useCallback((d) => {
    if (!date.isSame(d, 'year') || !date.isSame(d, 'month')) setDate(d);
  }, [date]);

  const handleFinish = useCallback(() => {
    dispatch(fetchUser(query.id));
  }, [dispatch, query]);

  useEffect(() => {
    if (query.id) {
      dispatch(
        fetchUserCalendar(
          query.id, {
            mode: RESPONSE_MODE.MINIMAL,
            filters: [{ name: 'date', value: [date.format('YY-MM')] }],
          },
        ),
      );
    }
  }, [dispatch, query, date]);

  return (
    <>
      <AddWorktimeModal visible={modalVisible} onCancel={() => toggleModal(false)} onFinish={handleFinish} />
      <AntCalendar fullscreen={false} dateFullCellRender={renderCell} onChange={handleChange} />
    </>
  );
};

export default Calendar;
