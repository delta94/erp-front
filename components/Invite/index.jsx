import { useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Form, Input, Result, Skeleton, Card, Row, message,
} from 'antd';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Invite.module.scss';
import { fetchInvitationByCode } from '../../store/invitations/actions';
import { invitationSelector } from '../../store/invitations/selectors';
import { register } from '../../store/auth/actions';
import { signedUserSelector } from '../../store/auth/selectors';
import { parseErrors } from '../../utils';

const Invite = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { query, push } = useRouter();
  const [invitation, loading, isFound] = useSelector(invitationSelector);
  const [, authLoading] = useSelector(signedUserSelector);

  useEffect(() => {
    if (query.code) dispatch(fetchInvitationByCode(query.code));
  }, [dispatch, query]);

  const submit = useCallback(async (d) => {
    const { error } = dispatch(register({ ...d, invitation_id: invitation.id }));
    if (error?.response?.data?.errors) {
      form.setFields(parseErrors(error.response.data.errors));
    } else if (error) {
      message.error(error.message);
    } else {
      await push('/users');
    }
  }, [dispatch, push, invitation, form]);

  const content = useMemo(() => (
    <Form
      name='register'
      form={form}
      initialValues={{ name: invitation?.name }}
      onFinish={submit}
    >
      <Form.Item
        name='name'
        rules={[{ required: true, message: 'Please fill in your Full Name!' }]}
      >
        <Input prefix={<UserOutlined className={styles.icon} />} placeholder='Full name' type='name' />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[
          { required: true, message: 'Please input your Password!' },
          { type: 'string', min: 6, message: 'Your password must be at least 6 characters long' },
        ]}
      >
        <Input
          prefix={<LockOutlined className={styles.icon} />}
          type='password'
          placeholder='Password'
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' className={styles.button} loading={authLoading}>
          Create Account
        </Button>
      </Form.Item>
    </Form>
  ), [submit, invitation, authLoading]);

  return (
    <Row align='middle' justify='center' className={styles.container}>
      <Col md={12} xs={22} lg={8} sm={18}>
        <Card className={styles.form}>
          <Skeleton loading={loading} active>
            {
              !isFound && !loading
                ? <Result status='404' title='Not Found' subTitle='Sorry, such invitation does not exist.' />
                : content
            }
          </Skeleton>
        </Card>

      </Col>
    </Row>

  );
};

export default Invite;
