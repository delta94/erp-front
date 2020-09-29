import {
  useCallback, useState, useMemo, useEffect,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Card, message, Badge, Tag, InputNumber,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Payments.module.scss';
import { ORIGIN_COLORS, PAYMENT_STATUS_COLORS, RESPONSE_MODE } from '../../utils/constants';
import {
  filterByLabel, mapOptions, parseErrors, ucFirst,
} from '../../utils';
import { paymentStatusesSelector } from '../../store/payments/selectors';
import { addPayment, fetchPaymentStatuses } from '../../store/payments/actions';
import { clientsSelector } from '../../store/clients/selectors';
import { fetchClients } from '../../store/clients/actions';
import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';
import { accountsSelector } from '../../store/accounts/selectors';
import { fetchAccounts } from '../../store/accounts/actions';

const AddPayment = () => {
  const dispatch = useDispatch();
  const [statuses, statusesLoading] = useSelector(paymentStatusesSelector);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [clients, , clientsLoading] = useSelector(clientsSelector);
  const [users, , usersLoading] = useSelector(usersSelector);
  const [accounts, , accountsLoading] = useSelector(accountsSelector);

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Badge status={PAYMENT_STATUS_COLORS[s]} text={ucFirst(s)} className={styles.badge} />
    </Select.Option>
  )), [statuses]);

  const clientOptions = useMemo(() => mapOptions(clients), [clients]);

  const developerOptions = useMemo(() => mapOptions(users), [users]);

  const accountOptions = useMemo(() => accounts.map((a, idx) => (
    <Select.Option key={idx.toString()} value={a.id} label={a.name}>
      <Tag color={ORIGIN_COLORS[a.type]}>{ a.type }</Tag>
      { a.name }
    </Select.Option>
  )), [accounts]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addPayment(values));
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors));
      } else if (error) {
        message.error(error.message);
      } else {
        form.resetFields();
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch]);

  useEffect(() => {
    dispatch(fetchPaymentStatuses());
    dispatch(fetchClients({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchAccounts({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL, roles: ['developer'] }));
  }, [dispatch]);

  return (
    <Card title='Add Payment' className={styles.container}>
      <Form
        form={form}
        layout='vertical'
        className={styles.fullWidth}
      >
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              label='Amount'
              name='amount'
              required
              rules={[
                { required: true, message: 'Amount is required!' },
                { min: 1, type: 'number', message: 'Amount must be more than 1' },
              ]}
            >
              <InputNumber placeholder='Amount' type='number' min={1} className={styles.fullWidth} />
            </Form.Item>
            <Form.Item
              label='Payer'
              name='payer'
              required
              rules={[
                { required: true, message: 'Select payer!' },
              ]}
            >
              <Select
                showSearch
                placeholder='Payer'
                options={clientOptions}
                loading={clientsLoading}
              />
            </Form.Item>
            <Form.Item
              label='Account'
              name='account'
              required
              rules={[
                { required: true, message: 'Select account!' },
              ]}
            >
              <Select
                showSearch
                placeholder='Account'
                loading={accountsLoading}
                filterOption={filterByLabel}
              >
                {accountOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Status'
              name='status'
              required
              rules={[
                { required: true, message: 'Status is required!' },
              ]}
            >
              <Select
                showSearch
                placeholder='Status'
                loading={statusesLoading}
              >
                { statusOptions }
              </Select>
            </Form.Item>
            <Form.Item
              label='Recipient'
              name='recipient'
              required
              rules={[
                { required: true, message: 'Recipient is required!' },
              ]}
            >
              <Select
                showSearch
                placeholder='Recipient'
                options={developerOptions}
                loading={usersLoading}
              />
            </Form.Item>
            <Form.Item
              label='Purpose'
              name='purpose'
            >
              <Input placeholder='Purpose' />
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
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddPayment;
