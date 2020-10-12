import {
  useCallback, useState, useEffect, useRef, useMemo,
} from 'react';
import {
  Card, message, PageHeader, Result,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Users.module.scss';
import UserForm from './components/UserForm';
import { parseErrors } from '../../utils';
import { RESPONSE_MODE } from '../../utils/constants';
import { editUser, fetchUser } from '../../store/users/actions';
import { userSelector } from '../../store/users/selectors';

const EditUser = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, loading, isFound] = useSelector(userSelector);

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
  }) : ({})), [user]);

  useEffect(() => {
    if (query.id) dispatch(fetchUser(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit User'
        onBack={back}
      />
      {
        !isFound && !loading
          ? <Result status='404' title='Not Found' subTitle='Sorry, such user does not exist.' />
          : (
            <Card className={styles.container}>
              <UserForm
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

export default EditUser;
