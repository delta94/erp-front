import {
  useCallback, useState, useMemo, useEffect,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Card, message, Badge, InputNumber,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Expenses.module.scss';
import { PAYMENT_STATUS_COLORS, CURRENCY_SYMBOLS } from '../../utils/constants';
import { parseErrors, ucFirst } from '../../utils';
import { fetchExpenseStatuses, addExpense } from '../../store/expenses/actions';
import { expenseStatusesSelector } from '../../store/expenses/selectors';

const CURRENCY_OPTIONS = Object.keys(CURRENCY_SYMBOLS).map((code) => ({
  label: `${code.toUpperCase()} (${CURRENCY_SYMBOLS[code]})`, value: code,
}));

const AddPayment = () => {
  const dispatch = useDispatch();
  const [statuses, statusesLoading] = useSelector(expenseStatusesSelector);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Badge status={PAYMENT_STATUS_COLORS[s]} text={ucFirst(s)} className={styles.badge} />
    </Select.Option>
  )), [statuses]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addExpense(values));
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
    dispatch(fetchExpenseStatuses());
  }, [dispatch]);

  return (
    <Card title='Add Expense' className={styles.container}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              label='Currency'
              name='currency'
              required
              rules={[
                { required: true, message: 'Currency is required!' },
              ]}
            >
              <Select
                showSearch
                placeholder='Currency'
                options={CURRENCY_OPTIONS}
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
