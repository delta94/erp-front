import {
  useCallback, useState, useEffect, useRef, useMemo,
} from 'react';
import {
  Card, message, PageHeader, Result,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Clients.module.scss';
import ClientForm from './components/ClientForm';
import { parseErrors } from '../../utils';
import { editClient, fetchClient } from '../../store/clients/actions';
import { clientSelector } from '../../store/clients/selectors';
import { RESPONSE_MODE } from '../../utils/constants';

const EditClient = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [client, loading, isFound] = useSelector(clientSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editClient(client.id, values));
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
  }, [form, dispatch, client]);

  const initialValues = useMemo(() => (Object.keys(client).length > 0 ? ({
    ...client,
    photos: client.photos.map((item, idx) => ({
      ...item,
      key: idx,
      uid: idx,
      name: item.url.substring(item.url.lastIndexOf('/') + 1),
    })),
  }) : ({})), [client]);

  useEffect(() => {
    if (query.id) dispatch(fetchClient(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit Client'
        onBack={back}
      />
      {
        !isFound && !loading
          ? <Result status='404' title='Not Found' subTitle='Sorry, such client does not exist.' />
          : (
            <Card className={styles.container}>
              <ClientForm
                onSubmit={handleSubmit}
                submitting={submitting}
                initialValues={initialValues}
                formRef={form}
              />
            </Card>
          )
      }
    </>
  );
};

export default EditClient;
