import { useCallback, useState, useRef } from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Accounts.module.scss';
import AccountForm from './components/AccountForm';
import { parseErrors } from '../../utils';
import { addAccount } from '../../store/accounts/actions';

const AddAccount = () => {
  const dispatch = useDispatch();
  const { back } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addAccount({ ...values, type: values.type[0] }));
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
        title='Add Account'
        onBack={back}
      />
      <Card className={styles.container}>
        <AccountForm
          onSubmit={handleSubmit}
          submitting={submitting}
          formRef={form}
        />
      </Card>
    </>
  );
};

export default AddAccount;
