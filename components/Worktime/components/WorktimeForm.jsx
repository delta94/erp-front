import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Badge,
  Button, Col, DatePicker, Form, Row, Select, Switch, TimePicker, Tooltip,
} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from '../Worktime.module.scss';
import {
  clearUsers, clearUserSubState, fetchUserProjects, fetchUsers,
} from '../../../store/users/actions';
import { RESPONSE_MODE, STATUS_COLORS } from '../../../utils/constants';
import { clearProjects } from '../../../store/projects/actions';
import { userProjectsSelector, usersSelector } from '../../../store/users/selectors';
import { mapOptions } from '../../../utils';

const WorktimeForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [rangeMode, toggleMode] = useState(false);
  const [val, setValues] = useState(form.getFieldsValue());
  const [users, , usersLoading] = useSelector(usersSelector);
  const [projects, , projectsLoading] = useSelector(userProjectsSelector);

  const selectedProject = useMemo(
    () => (val.project ? projects.find((p) => p.id === val.project) : null),
    [val, projects],
  );

  const userOptions = useMemo(() => mapOptions(users), [users]);

  const projectOptions = useMemo(() => projects.map((p, idx) => (
    <Select.Option key={idx.toString()} value={p.id} label={p.title}>
      <Badge status={STATUS_COLORS[p.pivot?.status] || 'default'} className={styles.selectBadge} />
      { p.title }
    </Select.Option>
  )), [projects]);

  const onUserChange = useCallback(({ user }) => {
    form.setFields([{ name: 'project', value: null }]);
    dispatch(fetchUserProjects(user, { mode: RESPONSE_MODE.MINIMAL, with: ['pivot'] }));
  }, [dispatch, form]);

  const handleFormChange = useCallback(async (event) => {
    if (event.user) await onUserChange(event);
    setValues(form.getFieldsValue());
  }, [form, onUserChange]);

  const handleRouteChange = useCallback(() => {
    dispatch(clearUsers());
    dispatch(clearProjects());
    dispatch(clearUserSubState('projects'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL }));
    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, events, handleRouteChange]);

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    formRef.current = form;
  }, [form, formRef]);

  return (
    <Form
      form={form}
      initialValues={initialValues || {}}
      onValuesChange={handleFormChange}
      layout='vertical'
      {...props}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            name='user'
            label='User'
            rules={[{ required: true, message: 'Please select user!' }]}
          >
            <Select placeholder='User' options={userOptions} loading={usersLoading} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='project'
            label='Project'
            rules={[{ required: true, message: 'Please select project!' }]}
          >
            <Select
              placeholder='Project'
              loading={projectsLoading}
              disabled={!val.user || !projectOptions.length}
            >
              { projectOptions }
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} className={styles.relative}>
          <Form.Item
            name='date'
            label='Date'
            rules={[{ required: true, message: 'Please select date!' }]}
          >
            {
              rangeMode
                ? (<DatePicker.RangePicker className={styles.fullWidth} />)
                : (<DatePicker placeholder='Date' className={styles.fullWidth} />)
            }
          </Form.Item>
          {
            rangeMode && (
              <Tooltip title='Exclude weekends?'>
                <Form.Item
                  className={styles.switch}
                  name='exclude_weekends'
                  valuePropName='checked'
                  title='Exclude weekends'
                  style={{ right: '40px', top: '-6px' }}
                >
                  <Switch size='small' />
                </Form.Item>
              </Tooltip>
            )
          }
          <Tooltip title='Switch to range mode'>
            <Switch className={styles.switch} size='small' onChange={() => toggleMode((s) => !s)} />
          </Tooltip>
        </Col>
        <Col span={12}>
          <Form.Item
            name='time'
            label={(
              <Tooltip
                title={selectedProject ? `Weekly limit: ${selectedProject.pivot?.weekly_limit}` : null}
              >
                { rangeMode ? 'Time (per day)' : 'Time' }
              </Tooltip>
            )}
            rules={[{ required: true, message: 'Please select time!' }]}
          >
            <TimePicker placeholder='Time' className={styles.fullWidth} format='HH:mm' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={24}>
          <Form.Item noStyle>
            <Button
              type='primary'
              htmlType='submit'
              className={styles.submit}
              onClick={onSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

WorktimeForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

WorktimeForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default WorktimeForm;
