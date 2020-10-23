import { useState, useCallback, useRef } from 'react';
import { message, PageHeader, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Raises.module.scss';
import RaiseForm from './components/RaiseForm';
import { parseErrors } from '../../utils';
import { addRaise } from '../../store/raises/actions';

const AddRaise = () => {
  const dispatch = useDispatch();
  const { back } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addRaise(values));
      if (error?.response?.data?.errors) {
        form.current.setFields(parseErrors(error.response.data.errors));
      } else if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else if (error) {
        message.error(error.message);
      } else {
        form.current.resetFields();
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(() => false);
    }
  }, [form, dispatch]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Add Raise'
        onBack={back}
      />
      <Card className={styles.container}>
        <RaiseForm
          onSubmit={handleSubmit}
          submitting={submitting}
          formRef={form}
        />
      </Card>
    </>
  );
};

export default AddRaise;
