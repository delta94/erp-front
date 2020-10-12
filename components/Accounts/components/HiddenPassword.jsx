import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { decryptPassword } from '../../../utils';

const HiddenPassword = ({ children: password, iv }) => {
  const [shown, toggle] = useState(false);

  return (
    <Popconfirm title={`${shown ? 'Hide' : 'Show'} password?`} onConfirm={() => toggle((state) => !state)}>
      {
        shown
          ? decryptPassword(password, iv)
          : (<Button type='link' style={{ color: '#262626' }} icon={<EyeOutlined />}>************</Button>)
      }
    </Popconfirm>
  );
};

HiddenPassword.propTypes = {
  children: PropTypes.string.isRequired,
  iv: PropTypes.string.isRequired,
};

export default HiddenPassword;
