import {
  useCallback, useState, useMemo, useEffect,
} from 'react';
import {
  Form, Button, Col, Row, Select, Badge, Tag, DatePicker, InputNumber, Input, Modal, Switch, Tooltip, Divider, message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import classNames from 'classnames';
import moment from 'moment';

import PropTypes from 'prop-types';
import styles from '../Payments.module.scss';
import {
  CURRENCY_SYMBOLS,
  HOURS_CAP, ORIGIN_COLORS, PAYMENT_STATUS_COLORS, RESPONSE_MODE, STATUS_COLORS,
} from '../../../utils/constants';
import { filterByLabel, parseErrors, parseObject } from '../../../utils';
import {
  clearProjects, fetchProjectAccounts, fetchProjects, fetchProjectWorktime,
} from '../../../store/projects/actions';
import { projectAccountsSelector, projectsSelector } from '../../../store/projects/selectors';
import { fetchPaymentStatuses, generateInvoice } from '../../../store/payments/actions';
import { paymentStatusesSelector } from '../../../store/payments/selectors';
import { fetchAccountPayments, fetchAccountProjectDetails } from '../../../store/accounts/actions';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const TAX_TYPE_OPTIONS = [
  { label: 'Flat', value: 'flat' },
  { label: 'Percent', value: 'percent' },
];

const convertToInitialValues = ({ options, ...rest }) => {
  const o = { ...rest };
  if (options) {
    const { due_date: dueDate, date, ...opts } = options;
    o.options = { ...opts };
    if (dueDate) o.options.due_date = moment(dueDate);
    if (date) o.date = moment(date);
  }
  return o;
};

const PaymentForm = ({
  onSubmit, submitting, initialValues, formRef, ...props
}) => {
  const dispatch = useDispatch();
  const { events } = useRouter();
  const [form] = Form.useForm();
  const [val, setValues] = useState(form.getFieldsValue());
  const [accounts, , accountsLoading] = useSelector(projectAccountsSelector);
  const [projects, , projectsLoading] = useSelector(projectsSelector);
  const [statuses, , statusesLoading] = useSelector(paymentStatusesSelector);
  const [details, setDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [requestingPreview, setLoading] = useState(false);
  const [requestingPayment, setPaymentLoading] = useState(false);
  const [optionsShown, toggleOptions] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === val.project), [projects, val]);

  const account = useMemo(() => accounts.find((a) => a.id === val.account), [accounts, val]);

  const statusOptions = useMemo(() => statuses.map((s, idx) => (
    <Select.Option key={idx.toString()} value={s}>
      <Badge className={styles.selectBadge} status={PAYMENT_STATUS_COLORS[s]} text={s} />
    </Select.Option>
  )), [statuses]);

  const accountOptions = useMemo(() => accounts.map((a, idx) => (
    <Select.Option key={idx.toString()} value={a.id} label={a.name}>
      <Tag color={ORIGIN_COLORS[a.type]}>{ a.type }</Tag>
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

  const currencyOptions = useMemo(() => {
    const keys = Object.keys(CURRENCY_SYMBOLS);
    const arr = [];
    for (let i = 0; i < keys.length; i += 1) {
      arr.push({ label: CURRENCY_SYMBOLS[keys[i]], value: keys[i] });
    }
    return arr;
  }, []);

  const handleRangeChange = useCallback(async (idx, event) => {
    if (event) {
      const { data } = await dispatch(fetchProjectWorktime(project.id, {
        mode: RESPONSE_MODE.MINIMAL,
        filters: [
          { name: 'from', value: event[0].format('YYYY-MM-DD') },
          { name: 'to', value: event[1].format('YYYY-MM-DD') },
          { name: 'user', value: [details?.user_id] },
        ],
      }, { silent: true }));
      if (data?.data) {
        const totalTime = data.data.reduce((all, item) => all + item.time, 0).toFixed(2);
        form.setFields([{ name: ['items', idx, 'time'], value: totalTime }]);
      }
    }
  }, [dispatch, form, project, details]);

  const renderItemField = useCallback((fields, { remove }) => fields.map((field, idx) => (
    <Row gutter={10} key={idx.toString()} className={styles.relative}>
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
          rules={[
            { required: true, message: 'Provide correct Time!' },
          ]}
        >
          <InputNumber
            placeholder='Time worked'
            className={styles.fullWidth}
            step='0.01'
            disabled={!val?.items?.[idx]?.range || accountsLoading}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          label='Rate'
          name={[idx, 'rate']}
          required
          rules={[
            { required: true, message: 'Provide correct Rate!' },
          ]}
        >
          <InputNumber
            placeholder='Rate'
            className={styles.fullWidth}
            step='0.01'
            disabled={!val.account || accountsLoading}
            loading={accountsLoading}
          />
        </Form.Item>
      </Col>
      <Col span={10}>
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
            placeholder='Item description'
          />
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
    </Row>
  )), [val, accountsLoading, handleRangeChange]);

  const handleItemsChange = useCallback(() => {
    const data = form.getFieldsValue(['items']);
    if (details) {
      const rate = details.salary_based
        ? (details.rate / HOURS_CAP).toFixed(2)
        : details.rate;
      form.setFields(data.items.map((item, idx) => ({ name: ['items', idx, 'rate'], value: rate })));
    }
  }, [form, details]);

  const handleFormChange = useCallback(async (event, values) => {
    if (event.project) {
      form.setFields([{ name: 'account', value: null }]);
      dispatch(fetchProjectAccounts(event.project, {
        with: ['user'],
        mode: RESPONSE_MODE.SIMPLIFIED,
        filters: [{ name: 'role', value: ['developer'] }],
      }));
    }
    if (event.account) {
      dispatch(fetchAccountProjectDetails(event.account, values.project, { silent: true }))
        .then(({ data }) => { if (data) setDetails(data); });
    }
    if (event.items) {
      handleItemsChange();
    }
    setValues(form.getFieldsValue());
  }, [dispatch, form, handleItemsChange]);

  const handleRouteChange = useCallback(() => dispatch(clearProjects()), [dispatch]);

  const handleGenerate = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const { data, error } = await dispatch(generateInvoice(values, { silent: true }));
      if (error?.response?.data) {
        const response = JSON.parse(await error?.response?.data.text());
        form.setFields(parseErrors(response.errors));
      } else if (error) {
        message.error(error.message);
      } else if (data) setFile(URL.createObjectURL(data));
    } catch (e) {
      // validation error
    } finally {
      setLoading(false);
    }
  }, [dispatch, form]);

  const handleFill = useCallback(async (field) => {
    let value = null;
    // eslint-disable-next-line default-case
    switch (field) {
      case 'to': {
        value = `${project.client.name}\n${project.client.email}\n${project.client.full_address}`;
        break;
      }
      case 'from': {
        value = `${account.name}\n${account.user.email}`;
        break;
      }
      case 'notes': {
        // eslint-disable-next-line max-len
        value = `Kindly make a payment at your earliest convenience.\nPlease do not hesitate to contact me with any questions.\nMany thanks, ${account.name}`;
        break;
      }
      case 'options': {
        setPaymentLoading(true);
        const { data, error } = await dispatch(
          fetchAccountPayments(account.id, { filters: [{ name: 'last', value: true }] }, { silent: true }),
        );
        setPaymentLoading(false);
        if (data.data?.[0]) {
          const payment = convertToInitialValues(data.data?.[0]);
          form.setFields(parseObject(payment.options, 'options'));
          setValues(form.getFieldsValue());
        }
        if (error || !data.data?.[0]) message.error(error.response?.message || error.message);
      }
    }
    if (value) form.setFields([{ name: ['options', field], value }]);
  }, [dispatch, form, project, account]);

  useEffect(() => {
    dispatch(fetchPaymentStatuses());
    dispatch(fetchProjects({
      mode: RESPONSE_MODE.MINIMAL,
      with: ['client', 'client.full_address', 'client.email'],
      pagination: false,
    }));
    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, events, handleRouteChange]);

  useEffect(() => {
    handleItemsChange();
  }, [handleItemsChange]);

  useEffect(() => {
    form.resetFields();
    setValues(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    formRef.current = form;
  }, [form, formRef]);

  return (
    <>
      <Form
        form={form}
        layout='vertical'
        className={classNames(styles.fullWidth, styles.relative)}
        onValuesChange={handleFormChange}
        initialValues={initialValues}
        {...props}
      >
        <Row gutter={10}>
          <Col span={8}>
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
          <Col span={8}>
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
          <Col span={8}>
            <Form.Item
              label='Status'
              name='status'
              required
              rules={[
                { required: true, message: 'Status is required' },
              ]}
            >
              <Select
                placeholder='Status'
                loading={statusesLoading}
              >
                {statusOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.List label='Items' name='items' onChange={handleItemsChange}>
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
        { optionsShown && <Divider className={styles.dividerSmall}>Options</Divider> }
        <Row gutter={10} className={styles.relative}>
          {
            optionsShown && (
              <Button
                type='link'
                className={classNames(styles.fillButton, styles.noPadding)}
                disabled={!val.account || !val.project}
                onClick={() => handleFill('options')}
                loading={requestingPayment}
              >
                Fill using previous data
              </Button>
            )
          }
          <Col span={12}>
            <Form.Item name={['options', 'date']} hidden={!optionsShown} label='Date'>
              <DatePicker className={styles.fullWidth} placeholder='Today' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['options', 'due_date']} hidden={!optionsShown} label='Due date'>
              <DatePicker className={styles.fullWidth} placeholder='Today + 2 days' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['options', 'quantity_header']} hidden={!optionsShown} label='Quantity header'>
              <Input placeholder='Hours' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['options', 'unit_cost_header']} hidden={!optionsShown} label='Unit cost header'>
              <Input placeholder='Rate/Hour ($)' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['options', 'number']} hidden={!optionsShown} label='Invoice number'>
              <Input placeholder='Auto' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['options', 'currency']} hidden={!optionsShown} label='Currency'>
              <Select placeholder='$' options={currencyOptions} showSearch />
            </Form.Item>
          </Col>
          <Col span={12} className={styles.relative}>
            <Form.Item name={['options', 'to']} hidden={!optionsShown} label='To'>
              <Input.TextArea placeholder='Leave empty to include email and name only' rows={3} />
            </Form.Item>
            {
              optionsShown && (
                <Button
                  type='link'
                  className={classNames(styles.topRight, styles.noPadding)}
                  disabled={!val.project}
                  onClick={() => handleFill('to')}
                >
                  Fill
                </Button>
              )
            }
          </Col>
          <Col span={12} className={styles.relative}>
            <Form.Item name={['options', 'from']} hidden={!optionsShown} label='From'>
              <Input.TextArea placeholder='Leave empty to include email and name only' rows={3} />
            </Form.Item>
            {
              optionsShown && (
                <Button
                  type='link'
                  className={classNames(styles.topRight, styles.noPadding)}
                  disabled={!val.account}
                  onClick={() => handleFill('from')}
                >
                  Fill
                </Button>
              )
            }
          </Col>
          <Col span={24} className={styles.relative}>
            <Form.Item name={['options', 'notes']} hidden={!optionsShown} label='Notes'>
              <Input.TextArea placeholder='Kindly make a payment at your earliest convenience...' rows={3} />
            </Form.Item>
            {
              optionsShown && (
                <Button
                  type='link'
                  className={classNames(styles.topRight, styles.noPadding)}
                  disabled={!val.account}
                  onClick={() => handleFill('notes')}
                >
                  Fill
                </Button>
              )
            }
          </Col>
          <Col span={24}>
            <Form.Item
              name={['options', 'tax']}
              label='Include tax?'
              hidden={!optionsShown}
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          {
            val.options?.tax && (
              <>
                <Col span={8}>
                  <Form.Item
                    name={['options', 'tax_type']}
                    label='Tax type'
                    rules={[
                      { required: true, message: 'Tax type is required' },
                    ]}
                  >
                    <Select placeholder='Type' options={TAX_TYPE_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['options', 'tax_amount']}
                    label='Tax amount'
                    rules={[
                      { required: true, message: 'Tax amount is required' },
                      { min: 0, type: 'number', message: 'Tax amount must be more than 0' },
                    ]}
                  >
                    <InputNumber placeholder='Amount' min={0} className={styles.fullWidth} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['options', 'tax_title']} label='Tax title'>
                    <Input placeholder='Tax' />
                  </Form.Item>
                </Col>
              </>
            )
          }
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Form.Item noStyle>
              <Button
                type='secondary'
                className={styles.left}
                onClick={handleGenerate}
                loading={requestingPreview}
                disabled={requestingPreview}
              >
                Preview Invoice
              </Button>
            </Form.Item>
            <div className={styles.switchWrap}>
              <Tooltip title='Toggle options'>
                <Switch size='small' onChange={() => toggleOptions((s) => !s)} />
              </Tooltip>
            </div>
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
      <Modal visible={!!file} width={660} onCancel={() => setFile(null)} destroyOnClose footer={null}>
        <Document file={file}><Page pageNumber={1} /></Document>
      </Modal>
    </>
  );
};

PaymentForm.propTypes = {
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formRef: PropTypes.object,
};

PaymentForm.defaultProps = {
  initialValues: {
    items: [{}],
  },
  submitting: false,
  onSubmit: () => {},
  formRef: null,
};

export default PaymentForm;
