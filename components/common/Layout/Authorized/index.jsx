import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout as AntLayout } from 'antd';
import {
  MenuUnfoldOutlined, MenuFoldOutlined,
} from '@ant-design/icons';

import Head from '../Head';
import styles from '../Layout.module.scss';
import Sidebar from './Sidebar';

const AuthorizedLayout = ({ title, children }) => {
  const [sidebarCollapsed, toggle] = useState(false);

  return (
    <>
      <Head title={title} />
      <AntLayout className={styles.container}>
        <Sidebar collapsed={sidebarCollapsed} />
        <AntLayout className='site-layout'>
          <AntLayout.Header className={styles.background} style={{ padding: 0 }}>
            {React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.trigger,
              onClick: () => toggle((state) => !state),
            })}
          </AntLayout.Header>
          <AntLayout.Content
            className={styles.background}
            style={{
              margin: '24px 16px',
            }}
          >
            { children }
          </AntLayout.Content>
        </AntLayout>
      </AntLayout>
    </>
  );
};

AuthorizedLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
};

AuthorizedLayout.defaultProps = {
  title: 'dygit',
};

export default AuthorizedLayout;