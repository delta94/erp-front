import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Form, Row, Col, Input, Button, Select, Tag,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from '../Accounts.module.scss';
import useTags from '../../../utils/hooks/useTags';
import { clearUsers, fetchUsers } from '../../../store/users/actions';
import { usersSelector } from '../../../store/users/selectors';
import { mapOptions } from '../../../utils';
import { accountCategoriesSelector } from '../../../store/accounts/selectors';
import { clearAccounts, fetchAccountCategories } from '../../../store/accounts/actions';
import { clearProjects, fetchProjectAccounts, fetchProjects } from '../../../store/projects/actions';
import { projectAccountsSelector, projectsSelector } from '../../../store/projects/selectors';
import { ACCOUNT_CATEGORY, ACCOUNT_CATEGORY_COLOR, RESPONSE_MODE } from '../../../utils/constants';

const AccountForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [val, setValues] = useState(form.getFieldsValue());
  const [categories, , categoriesLoading] = useSelector(accountCategoriesSelector);
  const [accounts, , accountsLoading] = useSelector(projectAccountsSelector);
  const [projects, , projectsLoading] = useSelector(projectsSelector);
  const [users, , usersLoading] = useSelector(usersSelector);
  const [tagsComponent] = useTags('account', 'Type', 1);

  const handleRouteChange = useCallback(() => {
    dispatch(clearUsers());
    dispatch(clearProjects());
    dispatch(clearAccounts());
  }, [dispatch]);

  const ownerOptions = useMemo(() => mapOptions(users), [users]);

  const projectOptions = useMemo(() => mapOptions(projects), [projects]);

  const accountOptions = useMemo(() => accounts.map((a, idx) => (
    <Select.Option key={idx.toString()} value={a.id} label={a.name}>
      <Tag color={a.color}>{ a.type }</Tag>
      { a.name }
    </Select.Option>
  )), [accounts]);

  const categoryOptions = useMemo(() => categories.map((category, idx) => (
    <Select.Option key={idx.toString()} value={category} label={category}>
      <Tag color={ACCOUNT_CATEGORY_COLOR[category] || 'default'}>
        {category}
      </Tag>
    </Select.Option>
  )), [categories]);

  const renderAdditionalFields = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row key={idx.toString()} gutter={16}>
      <Col span={8}>
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
      <Col span={2} className={styles.removeWrap}>
        <Button
          type='link'
          icon={<MinusCircleOutlined />}
          onClick={() => remove(field.name)}
          className={styles.remove}
        />
      </Col>
    </Row>
  )), []);

  const handleFormChange = useCallback((event) => {
    if (event.category === ACCOUNT_CATEGORY.PROJECT) {
      dispatch(fetchProjects({ mode: RESPONSE_MODE.MINIMAL }));
    }
    if (event.project) {
      dispatch(fetchProjectAccounts(event.project, {
        mode: RESPONSE_MODE.MINIMAL, filters: [{ name: 'category', value: [ACCOUNT_CATEGORY.AVATAR] }],
      }));
    }
    setValues(form.getFieldsValue());
  }, [dispatch, form]);

  useEffect(() => {
    dispatch(fetchAccountCategories());
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL }));
    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, events, handleRouteChange]);

  useEffect(() => {
    form.resetFields();
    if (initialValues?.category) {
      handleFormChange({ category: initialValues.category });
    }
    if (initialValues?.project) {
      handleFormChange({ project: initialValues.project });
    }
    setValues(initialValues);
  }, [form, initialValues, handleFormChange]);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    formRef.current = form;
  }, [form, formRef]);

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={initialValues}
      onValuesChange={handleFormChange}
      {...props}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label='Category'
            name='category'
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select
              placeholder='Category'
              loading={categoriesLoading}
            >
              {categoryOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          {
            val.category === ACCOUNT_CATEGORY.PROJECT && (
              <Form.Item
                label='Project'
                name='project'
                rules={[{ required: true, message: 'Project is required' }]}
              >
                <Select
                  placeholder='Project'
                  loading={projectsLoading}
                  options={projectOptions}
                />
              </Form.Item>
            )
          }
        </Col>
        <Col span={12}>
          <Form.Item
            label='Type'
            name='type'
            rules={[{ required: true, message: 'Type is required' }, () => ({
              validator(rule, value) {
                if (value.length > 1) return Promise.reject(new Error('Only one type is allowed'));
                return Promise.resolve();
              },
            })]}
          >
            { tagsComponent }
          </Form.Item>
        </Col>
        <Col span={12}>
          {
            val.category === ACCOUNT_CATEGORY.PROJECT
              ? (
                <Form.Item
                  label='Avatar'
                  name='account'
                  rules={[{ required: true, message: 'Avatar is required' }]}
                >
                  <Select
                    placeholder='Avatar'
                    loading={accountsLoading}
                    disabled={!val.project || !accountOptions.length}
                  >
                    { accountOptions }
                  </Select>
                </Form.Item>
              )
              : (
                <Form.Item
                  label='Owner'
                  name='owner'
                  rules={[{ required: true, message: 'Owner is required' }]}
                >
                  <Select placeholder='Owner' options={ownerOptions} loading={usersLoading} />
                </Form.Item>
              )
          }
        </Col>
        <Col span={12}>
          <Form.Item
            label='Login'
            name='login'
            rules={[{ required: true, message: 'Login is required' }]}
          >
            <Input placeholder='Login' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder='Password' autoComplete='new-password' />
          </Form.Item>
        </Col>
      </Row>
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

AccountForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

AccountForm.defaultProps = {
  initialValues: {},
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default AccountForm;
