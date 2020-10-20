import {
  useCallback, useState, useRef, useEffect, useMemo,
} from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Accounts.module.scss';
import AccountForm from './components/AccountForm';
import EntityAccessMiddleware from '../common/EntityAccessMiddleware';
import { decryptPassword, parseErrors } from '../../utils';
import { editAccount, fetchAccount } from '../../store/accounts/actions';
import { accountSelector } from '../../store/accounts/selectors';
import { RESPONSE_MODE } from '../../utils/constants';

const EditAccount = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [account, loading, response] = useSelector(accountSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editAccount(account.id, { ...values, type: values.type[0] }));
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
  }, [form, dispatch, account]);

  const initialValues = useMemo(() => (Object.keys(account).length > 0 ? ({
    ...account,
    owner: account.owner?.id,
    account: account.account?.id,
    project: account.project?.id,
    type: [account.type.name],
    password: decryptPassword(account.password, account.iv),
  }) : ({})), [account]);

  useEffect(() => {
    if (query.id) dispatch(fetchAccount(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit Account'
        onBack={back}
      />
      <EntityAccessMiddleware entityName='client' loading={loading} response={response}>
        <Card className={styles.container}>
          <AccountForm
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

export default EditAccount;
