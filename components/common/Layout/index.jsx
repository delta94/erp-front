import React from 'react';
import PropTypes from 'prop-types';
import { Layout as AntLayout } from 'antd';

import Head from './Head';
import styles from './Layout.module.scss';

const Layout = ({ title, children }) => (
  <>
    <Head title={title} />
    <AntLayout className={styles.container}>
      { children }
    </AntLayout>
  </>
);

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
};

Layout.defaultProps = {
  title: 'dygit',
};

export default Layout;
