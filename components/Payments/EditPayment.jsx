import {
  useCallback, useState, useRef, useMemo, useEffect,
} from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import moment from 'moment';

import styles from './Payments.module.scss';
import PaymentForm from './component/PaymentForm';
import EntityAccessMiddleware from '../common/EntityAccessMiddleware';
import { parseErrors } from '../../utils';
import { editPayment, fetchPayment } from '../../store/payments/actions';
import { RESPONSE_MODE } from '../../utils/constants';
import { paymentSelector } from '../../store/payments/selectors';

const EditPayment = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [payment, loading, response] = useSelector(paymentSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editPayment(payment.id, values));
      if (error?.response?.data?.errors) {
        form.current.setFields(parseErrors(error.response.data.errors));
      } else if (error) {
        message.error(error.message);
      } else {
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch, payment]);

  const initialValues = useMemo(() => (Object.keys(payment).length > 0 ? ({
    ...payment,
    account: payment.account_id,
    client: payment.client.id,
    project: payment.project_id,
    items: payment.items.map((item) => ({ ...item, range: [moment(item.range[0]), moment(item.range[1])] })),
    options: {
      ...payment.options,
      ...(payment.options.due_date ? { due_date: moment(payment.options.due_date) } : {}),
      ...(payment.options.date ? { date: moment(payment.options.date) } : {}),
    },
  }) : ({})), [payment]);

  useEffect(() => {
    if (query.id) dispatch(fetchPayment(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit Payment'
        onBack={back}
      />
      <EntityAccessMiddleware entityName='payment' loading={loading} response={response}>
        <Card className={styles.container}>
          <PaymentForm
            onSubmit={handleSubmit}
            submitting={submitting}
            initialValues={initialValues}
            formRef={form}
          />
        </Card>
      </EntityAccessMiddleware>
    </>
  );
};

export default EditPayment;
