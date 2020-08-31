import React, {
  useCallback, useState, useRef, useEffect, useMemo,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Card, Upload, message, Switch, Badge, DatePicker,
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Projects.module.scss';
import usePhotos from '../../utils/hooks/usePhoto';
import {
  URLS, BASE_URL, STATUS_COLORS, RESPONSE_MODE,
} from '../../utils/constants';
import {
  getXsrfToken, parseErrors, normFile, toUpperCase, filterByLabel,
} from '../../utils';
import { fetchClients } from '../../store/clients/actions';
import { projectStatusesSelector } from '../../store/projects/selectors';
import { fetchProjectStatuses, addProject } from '../../store/projects/actions';
import { clientsSelector } from '../../store/clients/selectors';
import { fetchUsers } from '../../store/users/actions';
import { usersSelector } from '../../store/users/selectors';

const AddProject = () => {
  const dispatch = useDispatch();
  const uploader = useRef(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadPhoto, deletePhoto] = usePhotos(form, uploader);
  const [statuses, statusesLoading] = useSelector(projectStatusesSelector);
  const [clients, , clientsLoading] = useSelector(clientsSelector);
  const [users, , usersLoading] = useSelector(usersSelector);
  const [isPending, setPending] = useState(form.getFieldsValue(['status']).status === 'pending');

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Badge status={STATUS_COLORS[s]} text={toUpperCase(s)} className={styles.badge} />
    </Select.Option>
  )), [statuses]);

  const mapOptions = useCallback((array) => array.map((item) => ({
    label: item.name, value: item.id,
  })), []);

  const clientOptions = useMemo(() => mapOptions(clients), [mapOptions, clients]);

  const developerOptions = useMemo(() => mapOptions(
    users.filter((u) => u.role === 'developer'),
  ), [mapOptions, users]);

  const managerOptions = useMemo(() => mapOptions(
    users.filter((u) => u.role === 'manager'),
  ), [mapOptions, users]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addProject(values));
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors, null, values));
      } else if (error) {
        message.error(error.message);
      } else {
        form.resetFields();
        message.success(data.message);
      }
    } catch (e) {
      // validation failed
    } finally {
      setSubmitting(false);
    }
  }, [form, dispatch]);

  const renderDeveloperFields = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row key={idx.toString()} gutter={10}>
      <Col span={10}>
        <Form.Item
          label='Developers'
          name={[idx, 'id']}
          required
          rules={[
            { required: true, message: 'Please select project\'s Developer!' },
          ]}
        >
          <Select
            placeholder='Developer'
            options={developerOptions}
            loading={usersLoading}
            filterOption={filterByLabel}
            showSearch
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label='Rate'
          name={[idx, 'rate']}
          required
          rules={[
            { required: true, message: 'Please input project\'s Rate!' },
          ]}
        >
          <Input placeholder='Rate $' type='number' />
        </Form.Item>
      </Col>
      <Col offset={1} span={3}>
        <Form.Item
          label='Salary Based'
          name={[idx, 'salary_based']}
          valuePropName='checked'
          required
        >
          <Switch />
        </Form.Item>
      </Col>
      <Col span={2} className={styles.removeWrap}>
        {
          fields.length > 1 && (
            <Button
              type='link'
              icon={<MinusCircleOutlined />}
              onClick={() => remove(field.name)}
              className={styles.remove}
            />
          )
        }
      </Col>
    </Row>
  )), [developerOptions, usersLoading]);

  useEffect(() => {
    dispatch(fetchProjectStatuses());
    dispatch(fetchClients({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL, roles: ['developer', 'manager'] }));
  }, [dispatch]);

  return (
    <Card title='Add Project'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          developers: [{
            id: '', rate: '', salary_based: false,
          }],
        }}
      >
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              label='Project Title'
              name='title'
              required
              rules={[
                { required: true, message: 'Please input project Title!' },
              ]}
            >
              <Input placeholder="Project's title" />
            </Form.Item>
            <Form.Item
              label='Client'
              name='client'
              required
              rules={[
                { required: true, message: 'Please select project\'s Client!' },
              ]}
            >
              <Select
                placeholder='Client'
                options={clientOptions}
                loading={clientsLoading}
                filterOption={filterByLabel}
                showSearch
              />
            </Form.Item>
            {
              isPending && (
                <Form.Item
                  label='Start Date'
                  name='start_date'
                  required
                  rules={[
                    { required: true, message: 'Please select project\'s Start Date!' },
                  ]}
                >
                  <DatePicker className={styles.datePicker} />
                </Form.Item>
              )
            }
          </Col>
          <Col span={12}>
            <Form.Item
              label='Status'
              name='status'
              required
              rules={[
                { required: true, message: 'Please select project\'s Status!' },
              ]}
            >
              <Select
                placeholder='Project status'
                loading={statusesLoading}
                onChange={() => setPending(form.getFieldsValue(['status']).status === 'pending')}
              >
                { statusOptions }
              </Select>
            </Form.Item>
            <Form.Item
              label='Managers'
              name='managers'
              required
              rules={[
                { required: true, message: 'Please select project\'s Managers!' },
              ]}
            >
              <Select
                placeholder='Managers'
                mode='multiple'
                options={managerOptions}
                loading={usersLoading}
                filterOption={filterByLabel}
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Form.List label='Developers' name='developers' required>
              {
                (...args) => (
                  <>
                    {renderDeveloperFields(...args)}
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => args[1].add()}
                        block
                      >
                        <PlusOutlined />
                        Add developer
                      </Button>
                    </Form.Item>
                  </>
                )
              }
            </Form.List>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name='photos'
              label='Photo'
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                action={BASE_URL + URLS.PHOTOS}
                ref={uploader}
                accept='image/*'
                name='photo'
                listType='picture'
                className={styles.uploadWrap}
                withCredentials
                multiple
                headers={{
                  'X-XSRF-TOKEN': getXsrfToken(),
                }}
                onRemove={deletePhoto}
              >
                <Button block className={styles.upload}>
                  <UploadOutlined />
                  Click to upload
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Input.Search
              placeholder='Or paste the link here'
              enterButton='Upload'
              onSearch={uploadPhoto}
              className={styles.uploadInput}
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Form.Item noStyle>
              <Button
                type='primary'
                htmlType='submit'
                className={styles.submit}
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddProject;
