import {
  useCallback, useState, useRef, useEffect, useMemo,
} from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import moment from 'moment';

import styles from './Raises.module.scss';
import RaiseForm from './components/RaiseForm';
import EntityAccessMiddleware from '../common/EntityAccessMiddleware';
import { parseErrors } from '../../utils';
import { RESPONSE_MODE } from '../../utils/constants';
import { raiseSelector } from '../../store/raises/selectors';
import { editRaise, fetchRaise } from '../../store/raises/actions';

const EditRaise = () => {
  const dispatch = useDispatch();
  const form = useRef(null);
  const { back, query } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [item, loading, response] = useSelector(raiseSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editRaise(item.id, values));
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
  }, [form, dispatch, item]);

  const initialValues = useMemo(() => (Object.keys(item).length > 0 ? ({
    ...item,
    user: item.user_id,
    project: item.project_id,
    starting_from: moment(item.starting_from),
  }) : ({})), [item]);

  useEffect(() => {
    if (query.id) dispatch(fetchRaise(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit Raise'
        onBack={back}
      />
      <EntityAccessMiddleware entityName='raise' loading={loading} response={response}>
        <Card className={styles.container}>
          <RaiseForm
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

export default EditRaise;
