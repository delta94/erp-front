import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Layout as AntLayout } from 'antd';
import {
  MenuUnfoldOutlined, MenuFoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../Layout.module.scss';
import Head from '../Head';
import Sidebar from './Sidebar';
import AvatarArea from './AvatarArea';
import { accountSelector } from '../../../../store/auth/selectors';
import { fetchAccount } from '../../../../store/auth/actions';

const AuthorizedLayout = ({ title, children }) => {
  const dispatch = useDispatch();
  const [user] = useSelector(accountSelector);
  const [sidebarCollapsed, toggle] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchAccount());
  }, [user, dispatch]);

  return (
    <>
      <Head title={title} />
      <AntLayout className={styles.container}>
        <Sidebar collapsed={sidebarCollapsed} />
        <AntLayout className='site-layout'>
          <AntLayout.Header className={classNames(styles.background, styles.header)}>
            {React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.trigger,
              onClick: () => toggle((state) => !state),
            })}
            <AvatarArea />
          </AntLayout.Header>
          <AntLayout.Content
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
