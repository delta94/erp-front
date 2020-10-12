import {
  useCallback, useState, useRef, useMemo, useEffect,
} from 'react';
import {
  Form, Input, Button, Col, Row, Select, Upload, Divider, Switch,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../Clients.module.scss';
import usePhotos from '../../../utils/hooks/usePhoto';
import { clientFieldTypesSelector, clientOriginsSelector } from '../../../store/clients/selectors';
import {
  COUNTRIES, CLIENT_FIELD_TYPE, URLS, BASE_URL,
} from '../../../utils/constants';
import {
  getXsrfToken, ucFirst, normFile, filterByLabel, prefixedName,
} from '../../../utils';
import { fetchClientFieldTypes, fetchClientOrigins } from '../../../store/clients/actions';

const ClientForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const uploader = useRef(null);
  const [form] = Form.useForm();
  const [additionalFields, setFields] = useState(form.getFieldsValue(['fields']).fields);
  const [origins, originsLoading] = useSelector(clientOriginsSelector);
  const [fieldTypes, fieldTypesLoading] = useSelector(clientFieldTypesSelector);
  const [uploadPhoto, deletePhoto] = usePhotos(form, uploader);

  const originOptions = useMemo(() => origins.map((o) => ({ value: o, label: o })), [origins]);

  const fieldTypeOptions = useMemo(() => fieldTypes.map((f) => ({ value: f, label: ucFirst(f) })), [fieldTypes]);

  const renderLinksField = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row key={idx.toString()} gutter={10}>
      <Col span={5}>
        <Form.Item name={[idx, 'type']}>
          <Select
            placeholder='Field type'
            options={fieldTypeOptions}
            loading={fieldTypesLoading}
            onChange={() => setFields(form.getFieldsValue(['fields']).fields)}
          />
        </Form.Item>
      </Col>
      <Col span={17}>
        <Form.Item name={[idx, 'value']}>
          <Input
            addonBefore={
              [CLIENT_FIELD_TYPE.LINK, CLIENT_FIELD_TYPE.WEBSITE, CLIENT_FIELD_TYPE.REDDIT, CLIENT_FIELD_TYPE.LINKEDIN]
                .includes(additionalFields?.[idx]?.type) ? 'https://' : ''
            }
            placeholder='Value'
          />
        </Form.Item>
      </Col>
      <Col span={2}>
        <Button
          type='link'
          icon={<MinusCircleOutlined />}
          onClick={() => remove(field.name)}
          className={styles.remove}
        />
      </Col>
    </Row>
  )), [form, additionalFields, fieldTypeOptions, fieldTypesLoading]);

  const handleCopyDetails = useCallback((val) => {
    const values = form.getFieldsValue();
    if (!val) {
      form.resetFields(Object.keys(values.bill_to).map((key) => ({ name: ['bill_to', key], value: '' })));
    }
    form.setFields(Object.keys(values.bill_to).map((key) => ({ name: ['bill_to', key], value: values[key] })));
  }, [form]);

  const clientDetails = useCallback((prefix = '', noOrigin) => (
    <>
      <Col span={12}>
        <Form.Item
          label='First Name'
          name={prefixedName(prefix, 'first_name')}
          required
          rules={[
            { required: true, message: 'Please input user First Name!' },
          ]}
        >
          <Input placeholder="Client's first name" />
        </Form.Item>
        <Form.Item
          label='Email'
          name={prefixedName(prefix, 'email')}
          required
          rules={[
            { required: true, message: 'Please input client\'s Email!' },
            { type: 'email', message: 'Please input valid Email!' },
          ]}
        >
          <Input placeholder="Client's email" type='email' />
        </Form.Item>
        <Form.Item
          label='Country'
          name={prefixedName(prefix, 'country')}
          required
          rules={[
            { required: true, message: 'Please select client\'s Country!' },
          ]}
        >
          <Select
            showSearch
            placeholder="Client's country"
            filterOption={filterByLabel}
            options={COUNTRIES.map((c) => ({ ...c, value: c.code, label: c.name }))}
          />
        </Form.Item>
        <Form.Item label='Street' name={prefixedName(prefix, 'street')}>
          <Input placeholder="Client's street" />
        </Form.Item>
        <Form.Item label='Phone Number' name={prefixedName(prefix, 'phone')}>
          <Input placeholder="Client's phone number" type='tel' />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label='Last Name'
          name={prefixedName(prefix, 'last_name')}
          required
          rules={[
            { required: true, message: 'Please input client\'s Last Name!' },
          ]}
        >
          <Input placeholder="Client's last name" />
        </Form.Item>
        <Form.Item
          label='City'
          name={prefixedName(prefix, 'city')}
          required
          rules={[
            { required: true, message: 'Please input client\'s City!' },
          ]}
        >
          <Input placeholder="Client's city" />
        </Form.Item>
        <Form.Item
          label='Company Name'
          name={prefixedName(prefix, 'company')}
        >
          <Input placeholder='Company Name' />
        </Form.Item>
        <Form.Item
          label='ZIP'
          name={prefixedName(prefix, 'zip')}
        >
          <Input placeholder="Client's ZIP" />
        </Form.Item>
        {
          !noOrigin && (
            <Form.Item
              label='Origin'
              name={prefixedName(prefix, 'origin')}
              required
              rules={[
                { required: true, message: 'Please select client\'s Origin!' },
              ]}
            >
              <Select
                showSearch
                placeholder="Client's origin"
                options={originOptions}
                loading={originsLoading}
              />
            </Form.Item>
          )
        }
      </Col>
    </>
  ), [originOptions, originsLoading]);

  useEffect(() => {
    dispatch(fetchClientOrigins());
    dispatch(fetchClientFieldTypes());
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
      className={styles.form}
      initialValues={initialValues}
      {...props}
    >
      <Row gutter={10}>
        { clientDetails() }
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
        <Col span={24}>
          <Form.List label='Links' name='fields'>
            {
              (...args) => (
                <>
                  {renderLinksField(...args)}
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
      <Divider>Bill To</Divider>
      <Row gutter={10}>
        <Col span={24}>
          <Form.Item label='Copy client details?'>
            <Switch onChange={handleCopyDetails} />
          </Form.Item>
        </Col>
        { clientDetails('bill_to', true) }
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

ClientForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

ClientForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default ClientForm;
