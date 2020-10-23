import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Badge, Button, Col, Form, Row, Select, Tag, DatePicker, InputNumber,
} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { QuestionOutlined } from '@ant-design/icons';
import styles from '../Raises.module.scss';
import {
  clearUsers, clearUserSubState, fetchUserProjects, fetchUsers,
} from '../../../store/users/actions';
import {
  RAISE_TYPE, RAISE_TYPE_DISPLAY, RESPONSE_MODE, STATUS_COLORS,
} from '../../../utils/constants';
import { clearProjects } from '../../../store/projects/actions';
import { userProjectsSelector, usersSelector } from '../../../store/users/selectors';
import { mapOptions } from '../../../utils';

const RaiseForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [val, setValues] = useState(form.getFieldsValue());
  const [users, , usersLoading] = useSelector(usersSelector);
  const [projects, , projectsLoading] = useSelector(userProjectsSelector);

  const typeOptions = useMemo(() => Object.values(RAISE_TYPE).map((type, idx) => {
    const display = RAISE_TYPE_DISPLAY[type];
    const Icon = display.icon || QuestionOutlined;
    return (
      <Select.Option key={idx.toString()} value={type}>
        <Tag color={display.color || 'default'}>
          <Icon />
          &nbsp;
          { type }
        </Tag>
      </Select.Option>
    );
  }), []);

  const userOptions = useMemo(() => mapOptions(users), [users]);

  const projectOptions = useMemo(() => projects.map((p, idx) => (
    <Select.Option key={idx.toString()} value={p.id} label={p.title}>
      <Badge status={STATUS_COLORS[p.pivot?.status] || 'default'} className={styles.selectBadge} />
      { p.title }
    </Select.Option>
  )), [projects]);

  const handleFormChange = useCallback(async (event, values) => {
    if (event.user && values?.type !== RAISE_TYPE.PERSONAL) {
      form.setFields([{ name: 'project', value: null }]);
      dispatch(fetchUserProjects(event.user, { mode: RESPONSE_MODE.MINIMAL, with: ['pivot'] }));
    }
    setValues(form.getFieldsValue());
  }, [dispatch, form]);

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
    if (initialValues?.type !== RAISE_TYPE.PERSONAL && initialValues?.user) {
      handleFormChange({ user: initialValues.user }, { type: initialValues.type });
    }
    form.resetFields();
    setValues(initialValues);
  }, [form, initialValues, handleFormChange]);

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
            name='type'
            label='Type'
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Select placeholder='Type'>
              { typeOptions }
            </Select>
          </Form.Item>
        </Col>
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
            name='starting_from'
            label='Start date'
            rules={[{ required: true, message: 'Start date is required' }]}
          >
            <DatePicker className={styles.fullWidth} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='amount'
            label={val.type === RAISE_TYPE.WEEKLY_LIMIT ? 'Current limit (hours)' : 'Raise amount ($)'}
            rules={[
              { required: true, message: 'Amount is required' },
            ]}
          >
            <InputNumber min={0} placeholder='Amount' className={styles.fullWidth} />
          </Form.Item>
        </Col>
        { val.type !== RAISE_TYPE.PERSONAL && (
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
        ) }
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

RaiseForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

RaiseForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default RaiseForm;
