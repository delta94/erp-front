import {
  useCallback, useRef, useEffect, useMemo,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Upload, Switch, Badge, DatePicker, Tag, Divider,
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import styles from '../Projects.module.scss';
import usePhotos from '../../../utils/hooks/usePhoto';
import useTags from '../../../utils/hooks/useTags';
import {
  URLS, BASE_URL, STATUS_COLORS, RESPONSE_MODE, USER_ROLE, ORIGIN_COLORS, ACCOUNT_TYPE,
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
  const [tagsComponent] = useTags('technology', 'Stack');

  const handleRouteChange = useCallback(() => dispatch(clearAccounts()), [dispatch]);

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
    <Row key={idx.toString()} gutter={10} className={styles.relative}>
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
      <Col span={5}>
        <Form.Item
          label='Status'
          name={[idx, 'status']}
          required
        >
          <Select placeholder='Status' loading={statusesLoading}>{ statusOptions }</Select>
        </Form.Item>
      </Col>
      <Col span={5}>
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
      <Col span={6}>
        <Form.Item
          label='Weekly limit'
          name={[idx, 'weekly_limit']}
          className={styles.labelAlign}
        >
          <Input placeholder='Leave empty if unlimited' type='number' />
        </Form.Item>
      </Col>
      <Col span={5}>
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
      {
        fields.length > 1 && (
          <Button
            type='link'
            icon={<MinusCircleOutlined style={{ fontSize: '15px' }} />}
            onClick={() => remove(field.name)}
            className={styles.removeButton}
            title='Remove row'
          />
        )
      }
      { fields.length > 1 && (<Divider className={styles.dividerSmall} />) }
    </Row>
  )), [developerOptions, accountOptions, accountsLoading, usersLoading, statusOptions, statusesLoading]);

  const renderAdditionalFields = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row key={idx.toString()} gutter={10}>
      <Col span={10}>
        <Form.Item
          label='Field name'
          name={[idx, 'name']}
          rules={[{ required: true, message: 'Field name is required' }]}
        >
          <Input placeholder='Name' />
        </Form.Item>
      </Col>
      <Col span={14}>
        <Form.Item
          label='Value'
          name={[idx, 'value']}
          rules={[{ required: true, message: 'Field value is required' }]}
        >
          <Input placeholder='Value' />
        </Form.Item>
      </Col>
      <Button
        type='link'
        icon={<MinusCircleOutlined style={{ fontSize: '15px' }} />}
        onClick={() => remove(field.name)}
        className={styles.removeButton}
        title='Remove row'
      />
    </Row>
  )), []);

  useEffect(() => {
    dispatch(fetchProjectStatuses());
    dispatch(fetchClients({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchAccounts({
      mode: RESPONSE_MODE.MINIMAL,
      filters: [{ name: 'type', value: [ACCOUNT_TYPE.PAYONEER, ACCOUNT_TYPE.UPWORK] }],
    }));
    dispatch(fetchUsers({
      mode: RESPONSE_MODE.MINIMAL,
      filters: [{ name: 'role', value: [USER_ROLE.DEVELOPER, USER_ROLE.MANAGER] }],
    }));
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
        </Col>
        <Col span={12}>
          <Form.Item
            label='Tech stack'
            name='tags'
            className={styles.labelAlign}
          >
            { tagsComponent }
          </Form.Item>
        </Col>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
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
        <Col span={24}>
          <Form.Item
            label='Description'
            name='description'
          >
            <Input.TextArea placeholder='Project description' />
          </Form.Item>
        </Col>
      </Row>
      <Divider className={styles.divider}>Developers</Divider>
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
      <Divider className={styles.divider}>Photos</Divider>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            name='photos'
            label='Photos'
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
      <Divider className={styles.divider}>Additional Fields</Divider>
      <Row gutter={10}>
        <Col span={24}>
          <Form.List label='Additional Fields' name='fields' required>
            {
              (...args) => (
                <>
                  {renderAdditionalFields(...args)}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => args[1].add()}
                      block
                    >
                      <PlusOutlined />
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )
            }
          </Form.List>
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
  initialValues: null,
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default ProjectForm;
