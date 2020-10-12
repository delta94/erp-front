import { useRef, useEffect, useMemo } from 'react';
import {
  Form, Input, Button, Col, Row, Select, Upload, Tag, InputNumber,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../Users.module.scss';
import usePhotos from '../../../utils/hooks/usePhoto';
import {
  URLS, BASE_URL, USER_STATUS_COLORS, USER_ROLE_COLORS,
} from '../../../utils/constants';
import { getXsrfToken, normFile, ucFirst } from '../../../utils';
import { fetchUserRoles, fetchUserStatuses } from '../../../store/users/actions';
import { userRolesSelector, userStatusesSelector } from '../../../store/users/selectors';

const UserForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const uploader = useRef(null);
  const [form] = Form.useForm();
  const [uploadPhoto, deletePhoto] = usePhotos(form, uploader);
  const [statuses, statusesLoading] = useSelector(userStatusesSelector);
  const [roles, rolesLoading] = useSelector(userRolesSelector);

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Tag color={USER_STATUS_COLORS[s] || 'cyan'}>{ucFirst(s)}</Tag>
    </Select.Option>
  )), [statuses]);

  const rolesOptions = useMemo(() => roles.map((r, idx) => (
    <Select.Option key={idx.toString()} value={r}>
      <Tag color={USER_ROLE_COLORS[r] || 'cyan'}>{ucFirst(r)}</Tag>
    </Select.Option>
  )), [roles]);

  useEffect(() => {
    dispatch(fetchUserStatuses());
    dispatch(fetchUserRoles());
  }, [dispatch]);

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
      initialValues={initialValues}
      {...props}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label='Name'
            name='name'
            rules={[
              { required: true, message: 'Name is required' },
            ]}
          >
            <Input placeholder="User's full name" />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'User email is required' },
              { type: 'email', message: 'Provide valid email' },
            ]}
          >
            <Input type='email' placeholder='Email' />
          </Form.Item>
          <Form.Item
            label='Rate'
            name='rate'
            rules={[
              { required: true, message: 'Rate is required' },
            ]}
          >
            <InputNumber placeholder='Monthly salary rate' className={styles.fullWidth} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='Status'
            name='status'
            rules={[
              { required: true, message: 'User status is required' },
            ]}
          >
            <Select
              placeholder='Status'
              loading={statusesLoading}
            >
              { statusOptions }
            </Select>
          </Form.Item>
          <Form.Item
            label='Roles'
            name='roles'
            rules={[
              { required: true, message: 'User role is required' },
            ]}
          >
            <Select
              placeholder='Roles'
              loading={rolesLoading}
              mode='multiple'
            >
              { rolesOptions }
            </Select>
          </Form.Item>
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

UserForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

UserForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default UserForm;
