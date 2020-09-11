import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Col, Row, Modal, Form, Select, Button, DatePicker, TimePicker, message,
} from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './AddWorktimeModal.module.scss';
import { mapOptions, parseErrors } from '../../../utils';
import { addUserWorktime, fetchUserProjects } from '../../../store/users/actions';
import { RESPONSE_MODE } from '../../../utils/constants';

const AddWorktimeModal = ({ visible, onCancel, onFinish }) => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(
        addUserWorktime(query.id, {
          worktime: values.worktime.map((item) => ({
            ...item,
            time: item.time.hour() + item.time.minute() / 60,
            date: item.date.format('YYYY-MM-DD'),
          })),
        }),
      );
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors));
      } else if (error) {
        message.error(error.message);
      } else {
        onFinish();
        message.success(data.message);
        form.resetFields();
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch, query, onFinish]);

  const renderField = useCallback((field, idx, arr, removeField) => (
    <Form.Item key={idx.toString()} className={styles.listItem}>
      <Row>
        <Col md={23} xs={22}>
          <Row gutter={16}>
            <Col md={12} xs={12}>
              <Form.Item
                name={[idx, 'date']}
                rules={[{ required: true, message: 'Please select date!' }]}
                required
              >
                <DatePicker placeholder='Date' className={styles.fullWidth} />
              </Form.Item>
            </Col>
            <Col md={12} xs={12}>
              <Form.Item
                name={[idx, 'time']}
                rules={[{ required: true, message: 'Please select time!' }]}
                required
              >
                <TimePicker placeholder='Time' className={styles.fullWidth} format='HH:mm' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name={[idx, 'project_id']}
                className={classNames(styles.inline, styles.fullWidth)}
              >
                <Select options={mapOptions(projects)} loading={loading} placeholder='Project' />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        {
          arr.length > 1 && (
            <Col md={1} xs={2}>
              <Button
                type='link'
                icon={<MinusCircleOutlined />}
                onClick={() => removeField(field.name)}
                className={styles.button}
              />
            </Col>
          )
        }
      </Row>
    </Form.Item>
  ), [projects, loading]);

  const fetchProjectOptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(
        fetchUserProjects(query.id, { mode: RESPONSE_MODE.MINIMAL }, { silent: true }),
      );
      if (data) setProjects(data.data);
    } finally {
      setLoading(false);
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (query.id && visible) fetchProjectOptions().catch(() => {});
  }, [query, visible, fetchProjectOptions]);

  return (
    <Modal
      title='Add worktime'
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      centered
      footer={[
        <Button key='back' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={submitting}>
          Add
        </Button>,
      ]}
    >
      <Form
        name='invite'
        form={form}
        initialValues={{
          worktime: [{
            date: '', time: '', project_id: '',
          }],
        }}
      >
        <Form.List name='worktime'>
          {
            (fields = [{}], { add, remove }) => (
              <>
                { fields.map((...args) => renderField(...args, remove)) }
                <Button
                  type='link'
                  icon={<PlusCircleOutlined />}
                  className={styles.button}
                  onClick={() => add()}
                >
                  Add more
                </Button>
              </>
            )
          }
        </Form.List>
      </Form>
    </Modal>
  );
};

AddWorktimeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
};

AddWorktimeModal.defaultProps = {
  onCancel: () => {},
  onFinish: () => {},
};

export default AddWorktimeModal;
