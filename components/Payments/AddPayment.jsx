import { useCallback, useState, useRef } from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Payments.module.scss';
import PaymentForm from './component/PaymentForm';
import { parseErrors } from '../../utils';
import { addPayment } from '../../store/payments/actions';

const AddPayment = () => {
  const dispatch = useDispatch();
  const { back } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addPayment(values));
      if (error?.response?.data?.errors) {
        form.current.setFields(parseErrors(error.response.data.errors));
      } else if (error) {
        message.error(error.message);
      } else {
        form.current.resetFields();
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Add Payment'
        onBack={back}
      />
      <Card className={styles.container}>
        <PaymentForm
          onSubmit={handleSubmit}
          submitting={submitting}
          formRef={form}
        />
      </Card>
    </>
  );
};

export default AddPayment;
