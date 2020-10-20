import {
  useCallback, useState, useEffect, useRef, useMemo,
} from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Users.module.scss';
import UserForm from './components/UserForm';
import EntityAccessMiddleware from '../common/EntityAccessMiddleware';
import { parseErrors } from '../../utils';
import { RESPONSE_MODE } from '../../utils/constants';
import { editUser, fetchUser } from '../../store/users/actions';
import { userSelector } from '../../store/users/selectors';

const EditUser = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, loading, response] = useSelector(userSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editUser(user.id, values));
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
  }, [form, dispatch, user]);

  const initialValues = useMemo(() => (Object.keys(user).length > 0 ? ({
    ...user,
    photos: user.photos?.map((item, idx) => ({
      ...item,
      key: idx,
      uid: idx,
      name: item.url.substring(item.url.lastIndexOf('/') + 1),
    })),
  }) : null), [user]);

  useEffect(() => {
    if (query.id) dispatch(fetchUser(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit User'
        subTitle={user.name}
        onBack={back}
      />
      <EntityAccessMiddleware entityName='user' response={response} loading={loading}>
        <Card className={styles.container}>
          <UserForm
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

export default EditUser;
