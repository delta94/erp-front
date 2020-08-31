import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Layout as AntLayout, Menu } from 'antd';
import {
  MailOutlined, DeploymentUnitOutlined, UnorderedListOutlined, TeamOutlined, SolutionOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

import styles from '../Layout.module.scss';

const LINKS = [
  {
    title: 'Users',
    icon: TeamOutlined,
    items: [
      { title: 'List', icon: UnorderedListOutlined, route: '/users' },
      { title: 'Invitations', icon: MailOutlined, route: '/invitations' },
    ],
  },
  { title: 'Projects', icon: DeploymentUnitOutlined, route: '/projects' },
  { title: 'Clients', icon: SolutionOutlined, route: '/clients' },
];

const Sidebar = ({ collapsed }) => {
  const router = useRouter();

  const [openedKey, selectedKey] = useMemo(
    () => {
      let tree = [];
      const rec = (link, idx) => {
        if (link.items) {
          tree.push(idx);
          return !!link.items.find(rec);
        }
        const res = link.route === router.route;
        if (res) tree.push(idx);
        return res;
      };
      for (let i = 0; i < LINKS.length; i += 1) {
        if (rec(LINKS[i], i)) {
          return [tree.slice(0, tree.length - 1).join('-'), tree.join('-')];
        }
        tree = [];
      }
      return [null, null];
    },
    [router],
  );

  const renderMenuItems = useCallback((link, idx, tree = []) => {
    const key = tree.length
      ? `${tree.join('-')}-${idx.toString()}`
      : idx.toString();

    if (link.items) {
      return (
        <Menu.SubMenu title={link.title} icon={<link.icon />} key={key}>
          {link.items.map((item, index) => renderMenuItems(item, index, [...tree, idx]))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item icon={<link.icon />} key={key}>
        <Link href={link.route}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>{ link.title }</a>
        </Link>
      </Menu.Item>
    );
  }, []);

  const links = useMemo(() => LINKS.map((item, idx) => renderMenuItems(item, idx)),
    [renderMenuItems]);

  return (
    <AntLayout.Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo} />
      <Menu
        theme='dark'
        mode='inline'
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={[openedKey]}
      >
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
