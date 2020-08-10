import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Layout as AntLayout, Menu } from 'antd';
import {
  UserOutlined, VideoCameraOutlined, UploadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

import styles from '../Layout.module.scss';

const LINKS = [
  { title: 'Users', icon: UserOutlined, route: '/users' },
  { title: 'Test', icon: VideoCameraOutlined, route: '/test' },
  { title: 'Test 2', icon: UploadOutlined, route: '/test-2' },
];

const Sidebar = ({ collapsed }) => {
  const router = useRouter();

  const currentLinkIdx = useMemo(
    () => LINKS.findIndex((link) => link.route === router.route),
    [router],
  );

  const links = useMemo(() => LINKS.map((link, idx) => (
    <Menu.Item icon={<link.icon />} key={idx.toString()}>
      <Link href={link.route}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>{ link.title }</a>
      </Link>
    </Menu.Item>
  )), []);

  return (
    <AntLayout.Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo} />
      <Menu theme='dark' mode='inline' defaultSelectedKeys={[currentLinkIdx.toString()]}>
        { links }
      </Menu>
    </AntLayout.Sider>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

Sidebar.defaultProps = {
  collapsed: false,
};

export default Sidebar;
