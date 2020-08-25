import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';
import {
  Col, Row, Modal, Form, Input, Button, Select, message,
} from 'antd';
import {
  MailOutlined, UserOutlined, PlusCircleOutlined, MinusCircleOutlined, SendOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import styles from './InviteModal.module.scss';
import { fetchUserRoles } from '../../../store/users/actions';
import { userRolesSelector } from '../../../store/users/selectors';
import { inviteUsers } from '../../../store/invitations/actions';
import { parseErrors } from '../../../utils';

const InviteModal = ({ visible, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const [roles, rolesLoading] = useSelector(userRolesSelector);
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(inviteUsers(values));
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors, 'Email has been already used'));
      } else if (error) {
        message.error(error.message);
      } else {
        onFinish();
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch, onFinish]);

  const renderField = useCallback((field, idx, arr, removeField) => (
    <Form.Item key={idx.toString()} className={styles.listItem}>
      <Row>
        <Col md={23} xs={22}>
          <Row>
            <Col md={12} xs={24}>
              <Form.Item
                name={[idx, 'email']}
                rules={[
                  { required: true, message: 'Please input user Email!' },
                  { type: 'email', message: 'Please input valid Email!' },
                  ({ getFieldsValue }) => ({
                    validator(rule, value) {
                      const values = getFieldsValue();
                      const duplicates = values.invitations
                        .filter((invitation) => invitation.email === value);
                      if (duplicates.length >= 2) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('Email must be unique!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                className={styles.inline}
              >
                <Input prefix={<MailOutlined className={styles.icon} />} placeholder='Email' />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name={[idx, 'role']}
                rules={[{ required: true, message: 'Please select user role!' }]}
              >
                <Select
                  placeholder='Role'
                  loading={rolesLoading}
                  disabled={rolesLoading}
                >
                  { roles.map((role, key) => (
                    <Select.Option
                      key={key.toString()}
                      value={role}
                      className={styles.option}
                    >
                      { role }
                    </Select.Option>
                  )) }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item
                name={[idx, 'name']}
                className={classNames(styles.inline, styles.fullWidth)}
              >
                <Input prefix={<UserOutlined className={styles.icon} />} placeholder='Name (Optional)' />
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
  ), [roles, rolesLoading]);

  useEffect(() => {
    dispatch(fetchUserRoles());
  }, [dispatch]);

  return (
    <Modal
      title='Invite people'
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      centered
      footer={[
        <Button key='before' type='link' icon={<SendOutlined />} className={classNames(styles.modalButton, styles.button)}>
          <Link href='/invitations'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>See past invitations</a>
          </Link>
        </Button>,
        <Button key='back' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={submitting}>
          Submit
        </Button>,
      ]}
    >
      <Form
        name='invite'
        form={form}
        initialValues={{
          invitations: [{
            name: '', email: '',
          }],
        }}
      >
        <Form.List name='invitations'>
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
                  Add another
                </Button>
              </>
            )
          }
        </Form.List>
      </Form>
    </Modal>
  );
};

InviteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
};

InviteModal.defaultProps = {
  onCancel: () => {},
  onFinish: () => {},
};

export default InviteModal;
