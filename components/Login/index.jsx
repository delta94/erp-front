import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Row, Col, Form, Checkbox, Button, Input,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { authorize } from '../../store/auth/actions';
import styles from './Login.module.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const dispatch = useDispatch();

  const submit = useCallback(({ email, password }) => {
    dispatch(authorize(email, password));
  }, [dispatch]);

  return (
    <Row className={styles.container}>
      <Col span={14} className={styles.left} />
      <Col span={10} className={styles.right}>
        <Form
          name='login'
          initialValues={{ remember: true }}
          onFinish={submit}
        >
          <Form.Item
            name='email'
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined className={styles.icon} />} placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className={styles.icon} />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className={styles.forgot} href=''>
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles.button}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
