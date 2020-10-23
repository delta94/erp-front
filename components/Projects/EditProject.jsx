import {
  useCallback, useState, useEffect, useRef, useMemo,
} from 'react';
import { Card, message, PageHeader } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import moment from 'moment';

import styles from './Projects.module.scss';
import ProjectForm from './components/ProjectForm';
import { parseErrors } from '../../utils';
import { RESPONSE_MODE } from '../../utils/constants';
import { editProject, fetchProject } from '../../store/projects/actions';
import { projectSelector } from '../../store/projects/selectors';
import EntityAccessMiddleware from '../common/EntityAccessMiddleware';

const EditProject = () => {
  const dispatch = useDispatch();
  const { back, query } = useRouter();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [project, loading, response] = useSelector(projectSelector);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.current.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(editProject(project.id, values));
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
  }, [form, dispatch, project]);

  const initialValues = useMemo(() => (Object.keys(project).length > 0 ? ({
    ...project,
    client: project.client?.id,
    developers: project.developers?.map((d) => ({
      ...d,
      ...d.pivot,
      start_date: moment(d.pivot?.start_date),
      account: d.pivot?.account_id,
    })),
    managers: project.managers?.map((m) => m.id),
    photos: project.photos?.map((item, idx) => ({
      ...item,
      key: idx,
      uid: idx,
      name: item.url.substring(item.url.lastIndexOf('/') + 1),
    })),
    tags: project.tags?.map((t) => t.name),
  }) : ({})), [project]);

  useEffect(() => {
    if (query.id) dispatch(fetchProject(query.id, { mode: RESPONSE_MODE.ORIGINAL }));
  }, [dispatch, query]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Edit Project'
        subTitle={project.title}
        onBack={back}
      />
      <EntityAccessMiddleware entityName='project' loading={loading} response={response}>
        <Card className={styles.container}>
          <ProjectForm
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

export default EditProject;
