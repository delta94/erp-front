import {
  useCallback, useState, useRef, useEffect, useMemo,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Upload, Switch, Badge, DatePicker, Tag,
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import styles from '../Projects.module.scss';
import usePhotos from '../../../utils/hooks/usePhoto';
import {
  URLS, BASE_URL, STATUS_COLORS, RESPONSE_MODE, USER_ROLE, ORIGIN_COLORS,
} from '../../../utils/constants';
import {
  getXsrfToken, normFile, ucFirst, filterByLabel, mapOptions,
} from '../../../utils';
import { fetchClients } from '../../../store/clients/actions';
import { projectStatusesSelector } from '../../../store/projects/selectors';
import { fetchProjectStatuses } from '../../../store/projects/actions';
import { clientsSelector } from '../../../store/clients/selectors';
import { fetchUsers } from '../../../store/users/actions';
import { usersSelector } from '../../../store/users/selectors';
import { clearAccounts, fetchAccounts } from '../../../store/accounts/actions';
import { accountsSelector } from '../../../store/accounts/selectors';

const ProjectForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const uploader = useRef(null);
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [uploadPhoto, deletePhoto] = usePhotos(form, uploader);
  const [statuses, statusesLoading] = useSelector(projectStatusesSelector);
  const [clients, , clientsLoading] = useSelector(clientsSelector);
  const [users, , usersLoading] = useSelector(usersSelector);
  const [accounts, , accountsLoading] = useSelector(accountsSelector);
  const [isPending, setPending] = useState(form.getFieldsValue(['status']).status === 'pending');

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Badge status={STATUS_COLORS[s]} text={ucFirst(s)} className={styles.badge} />
    </Select.Option>
  )), [statuses]);

  const clientOptions = useMemo(() => mapOptions(clients), [clients]);

  const developerOptions = useMemo(() => mapOptions(
    users.filter((u) => u.roles.includes(USER_ROLE.DEVELOPER)),
  ), [users]);

  const managerOptions = useMemo(() => mapOptions(
    users.filter((u) => u.roles.includes(USER_ROLE.MANAGER)),
  ), [users]);

  const accountOptions = useMemo(() => accounts.map((a, idx) => (
    <Select.Option key={idx.toString()} value={a.id} label={a.name}>
      <Tag color={ORIGIN_COLORS[a.type]}>{ a.type }</Tag>
      { a.name }
    </Select.Option>
  )), [accounts]);

  const renderDeveloperFields = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row key={idx.toString()} gutter={10}>
      <Col span={12}>
        <Form.Item
          label='Developer'
          name={[idx, 'id']}
          required
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
      <Col span={12}>
        <Form.Item
          label='Account (Avatar)'
          name={[idx, 'account']}
          required
        >
          <Select
            placeholder='Account'
            loading={accountsLoading}
            filterOption={filterByLabel}
            showSearch
          >
            { accountOptions }
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
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
      <Col span={4}>
        <Form.Item
          label='Start Date'
          name={[idx, 'start_date']}
          required
        >
          <DatePicker className={styles.fullWidth} />
        </Form.Item>
      </Col>
      <Col span={3}>
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
  )), [developerOptions, accountOptions, accountsLoading, usersLoading]);

  const handleRouteChange = useCallback(() => dispatch(clearAccounts()), [dispatch]);

  useEffect(() => {
    dispatch(fetchProjectStatuses());
    dispatch(fetchClients({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchAccounts({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL, roles: ['developer', 'manager'] }));
    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, events, handleRouteChange]);

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    formRef.current = form;
  }, [form, formRef]);

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={initialValues || {
        developers: [{
          id: '', rate: '', salary_based: false,
        }],
      }}
      {...props}
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
              onClick={onSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

ProjectForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

ProjectForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default ProjectForm;
