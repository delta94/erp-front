import {
  useCallback, useState, useMemo, useEffect, Fragment,
} from 'react';
import {
  Form, Button, Col, Row, Select, Card, message, Badge, Tag, PageHeader, DatePicker, InputNumber, Input, Modal,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { pdfjs, Document, Page } from 'react-pdf';

import styles from './Payments.module.scss';
import {
  HOURS_CAP,
  ORIGIN_COLORS, RESPONSE_MODE, STATUS_COLORS, USER_ROLE_COLORS,
} from '../../utils/constants';
import { filterByLabel, parseErrors } from '../../utils';
import { addPayment, generateInvoice } from '../../store/payments/actions';
import {
  clearProjects, fetchProjectAccounts, fetchProjects, fetchProjectWorktime,
} from '../../store/projects/actions';
import { projectAccountsSelector, projectsSelector } from '../../store/projects/selectors';
import { fetchUserProjectDetails } from '../../store/users/actions';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddPayment = () => {
  const dispatch = useDispatch();
  const { back, events } = useRouter();
  const [form] = Form.useForm();
  const [val, setValues] = useState(form.getFieldsValue());
  const [submitting, setSubmitting] = useState(false);
  const [accounts, , accountsLoading] = useSelector(projectAccountsSelector);
  const [projects, , projectsLoading] = useSelector(projectsSelector);
  const [details, setDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [requestingPreview, setLoading] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === val.project), [projects, val]);

  const accountOptions = useMemo(() => accounts.map((a, idx) => (
    <Select.Option key={idx.toString()} value={a.id} label={a.name}>
      <Tag color={ORIGIN_COLORS[a.type]}>{ a.type }</Tag>
      <Tag color={USER_ROLE_COLORS[a.user.role]}>{ a.user.role }</Tag>
      { a.name }
    </Select.Option>
  )), [accounts]);

  const projectOptions = useMemo(() => projects.map((p, idx) => (
    <Select.Option key={idx.toString()} value={p.id} label={p.title}>
      <Badge status={STATUS_COLORS[p.status]} className={styles.selectBadge} />
      { p.title }
      &nbsp;(
      <span className={styles.clientName}>
        { p.client.name}
      </span>
      )
    </Select.Option>
  )), [projects]);

  const handleRangeChange = useCallback(async (idx, event) => {
    if (event) {
      const { data } = await dispatch(fetchProjectWorktime(project.id, {
        mode: RESPONSE_MODE.MINIMAL,
        filters: [
          { name: 'from', value: event[0].format('YYYY-MM-DD') },
          { name: 'to', value: event[1].format('YYYY-MM-DD') },
          { name: 'user', value: [details?.pivot?.user_id] },
        ],
      }, { silent: true }));
      if (data?.data) {
        const totalTime = data.data.reduce((all, item) => all + item.time, 0).toFixed(2);
        form.setFields([{ name: ['items', idx, 'time'], value: totalTime }]);
      }
    }
  }, [dispatch, form, project, details]);

  const renderItemField = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Fragment key={idx.toString()}>
      <Col span={8}>
        <Form.Item
          label='Date Range'
          name={[idx, 'range']}
          rules={[
            { required: true, message: 'Select a date range!' },
          ]}
        >
          <DatePicker.RangePicker
            className={styles.fullWidth}
            disabled={!val.account || accountsLoading}
            onChange={(...args) => handleRangeChange(idx, ...args)}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          label='Time'
          name={[idx, 'time']}
          required
          rules={[
            { required: true, message: 'Provide correct Time!' },
          ]}
        >
          <InputNumber
            className={styles.fullWidth}
            step='0.01'
            disabled={!val?.items?.[idx]?.range || accountsLoading}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          label='Rate ($)'
          name={[idx, 'rate']}
          required
          rules={[
            { required: true, message: 'Provide correct Rate!' },
          ]}
        >
          <InputNumber
            className={styles.fullWidth}
            step='0.01'
            disabled={!val.account || accountsLoading}
            loading={accountsLoading}
          />
        </Form.Item>
      </Col>
      <Col span={9}>
        <Form.Item
          label='Description'
          name={[idx, 'description']}
          rules={[
            { required: true, message: 'Provide correct Description!' },
          ]}
        >
          <Input
            className={styles.fullWidth}
            disabled={!val.account || accountsLoading}
          />
        </Form.Item>
      </Col>
      <Col span={1}>
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
    </Fragment>
  )), [val, accountsLoading, handleRangeChange]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const { error, data } = await dispatch(addPayment(values));
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors));
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

  const handleGenerate = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const { data } = await dispatch(generateInvoice(values, { silent: true }));
      if (data) setFile(URL.createObjectURL(data));
    } catch (e) {
      // validation error
    } finally {
      setLoading(false);
    }
  }, [dispatch, form]);

  const onAccountChange = useCallback(async (event) => {
    const account = accounts.find((a) => a.id === event.account);
    const { data } = await dispatch(fetchUserProjectDetails(account.user.id, project.id, { silent: true }));
    if (data) setDetails(data);
  }, [dispatch, project, accounts]);

  const handleFormChange = useCallback(async (event) => {
    if (event.project) {
      form.setFields([{ name: 'account', value: null }]);
      dispatch(fetchProjectAccounts(event.project, {
        with: ['user'],
        mode: RESPONSE_MODE.SIMPLIFIED,
        pagination: false,
        filters: [{ name: 'role', value: ['developer'] }],
      }));
    }
    if (event.account) await onAccountChange(event);
    setValues(form.getFieldsValue());
  }, [dispatch, form, onAccountChange]);

  const handleRouteChange = useCallback(() => dispatch(clearProjects()), [dispatch]);

  useEffect(() => {
    dispatch(fetchProjects({ mode: RESPONSE_MODE.SIMPLIFIED, with: ['client'], pagination: false }));
    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, events, handleRouteChange]);

  useEffect(() => {
    const data = form.getFieldsValue(['items']);
    if (details) {
      const rate = details.pivot.salary_based
        ? (details.pivot.rate / HOURS_CAP).toFixed(2)
        : details.pivot.rate;
      form.setFields(data.items.map((item, idx) => ({ name: ['items', idx, 'rate'], value: rate })));
    }
  }, [form, val, details]);

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Add Payment'
        onBack={back}
      />
      <Card className={styles.container}>
        <Form
          form={form}
          layout='vertical'
          className={styles.fullWidth}
          onValuesChange={handleFormChange}
          initialValues={{ items: [{ }] }}
        >
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label='Project'
                name='project'
                required
                rules={[
                  { required: true, message: 'Select a project!' },
                ]}
              >
                <Select
                  showSearch
                  placeholder='Project'
                  loading={projectsLoading}
                  disabled={projectsLoading}
                >
                  {projectOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Recipient'
                name='account'
                required
                rules={[
                  { required: true, message: 'Select Recipient!' },
                ]}
              >
                <Select
                  showSearch
                  placeholder='Recipient'
                  loading={accountsLoading}
                  disabled={!val.project || accountsLoading}
                  filterOption={filterByLabel}
                >
                  {accountOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Form.List label='Items' name='items'>
              {
                (...args) => (
                  <>
                    {renderItemField(...args)}
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          onClick={() => args[1].add()}
                          block
                        >
                          <PlusOutlined />
                          Add item
                        </Button>
                      </Form.Item>
                    </Col>
                  </>
                )
              }
            </Form.List>
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item noStyle>
                <Button
                  type='secondary'
                  className={styles.right}
                  onClick={handleGenerate}
                  loading={requestingPreview}
                  disabled={requestingPreview}
                >
                  Preview Invoice
                </Button>
              </Form.Item>
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
      <Modal visible={!!file} width={660} onCancel={() => setFile(null)} destroyOnClose footer={null}>
        <Document file={file}><Page pageNumber={1} /></Document>
      </Modal>
    </>
  );
};

export default AddPayment;
