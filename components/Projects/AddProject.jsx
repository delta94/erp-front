import { useCallback, useState, useRef } from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styles from './Projects.module.scss';
import ProjectForm from './components/ProjectForm';
import { parseErrors } from '../../utils';
import { addProject } from '../../store/projects/actions';

const AddProject = () => {
  const dispatch = useDispatch();
  const { back } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addProject(values));
      if (error?.response?.data?.errors) {
        form.current.setFields(parseErrors(error.response.data.errors, null, values));
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
        title='Add Project'
        onBack={back}
      />
      <Card className={styles.container}>
        <ProjectForm
          onSubmit={handleSubmit}
          formRef={form}
          submitting={submitting}
        />
      </Card>
    </>
  );
};

export default AddProject;
