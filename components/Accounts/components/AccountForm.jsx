import {
  useCallback, useEffect, useMemo,
} from 'react';
import {
  Form, Row, Col, Input, Button, Select, Tag, Spin,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from '../Accounts.module.scss';
import { clearUsers, fetchUsers } from '../../../store/users/actions';
import { RESPONSE_MODE } from '../../../utils/constants';
import { usersSelector } from '../../../store/users/selectors';
import { mapOptions } from '../../../utils';
import { tagsSelector } from '../../../store/tags/selectors';
import { addTag, fetchTags } from '../../../store/tags/actions';

const AccountForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [users, , usersLoading] = useSelector(usersSelector);
  const [tags, , tagsLoading] = useSelector(tagsSelector);

  const handleRouteChange = useCallback(() => dispatch(clearUsers()), [dispatch]);

  const ownerOptions = useMemo(() => mapOptions(users), [users]);

  const tagRender = useCallback(({ label }) => (
    <Tag color={label.props?.color || 'default'}>
      { label.props?.children || label }
    </Tag>
  ), []);

  const tagOptions = useMemo(() => tags.map((tag, idx) => (
    <Select.Option key={idx.toString()} value={tag.name} label={tag.name}>
      <Tag color={tag.color || 'default'}>
        {tag.name}
      </Tag>
    </Select.Option>
  )), [tags]);

  const handleTagsChange = useCallback(async (newTags) => {
    for (let i = 0; i < newTags.length; i += 1) {
      if (!tags.find((t) => t.name === newTags[i])) {
        dispatch(
          addTag({ name: newTags[i], category: 'account', color: 'default' }, { append: true }),
        );
      }
    }
  }, [dispatch, tags]);

  const handleTagsSearch = useCallback((term) => {
    if (term.length >= 3) {
      dispatch(
        fetchTags({
          mode: RESPONSE_MODE.SIMPLIFIED,
          filters: [{ name: 'category', value: 'account' }, { name: 'term', value: term }],
        }),
      );
    }
  }, [dispatch]);

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

  useEffect(() => {
    dispatch(fetchUsers({ mode: RESPONSE_MODE.MINIMAL }));
    dispatch(fetchTags({ mode: RESPONSE_MODE.SIMPLIFIED, filters: [{ name: 'category', value: ['account'] }] }));
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
      initialValues={initialValues}
      {...props}
    >
      <Row gutter={10}>
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
            <Select
              placeholder='Type'
              mode='tags'
              maxTagCount={1}
              tagRender={tagRender}
              loading={tagsLoading}
              notFoundContent={tagsLoading ? <Spin size='small' /> : null}
              onChange={handleTagsChange}
              onSearch={handleTagsSearch}
              showArrow
            >
              {tagOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='Owner'
            name='owner'
            rules={[{ required: true, message: 'Owner is required' }]}
          >
            <Select placeholder='Owner' options={ownerOptions} loading={usersLoading} />
          </Form.Item>
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
