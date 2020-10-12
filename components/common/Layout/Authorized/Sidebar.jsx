import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Layout as AntLayout, Menu } from 'antd';
import {
  MailOutlined, DeploymentUnitOutlined, UnorderedListOutlined, TeamOutlined, SolutionOutlined, DollarCircleOutlined,
  BankOutlined, WalletOutlined, ContactsOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';
import styles from '../Layout.module.scss';
import { USER_ROLE } from '../../../../utils/constants';
import { signedUserSelector } from '../../../../store/auth/selectors';

const LINKS = {
  ACCOUNTS: {
    title: 'Accounts',
    icon: ContactsOutlined,
    route: '/accounts',
  },
  USERS: {
    title: 'Users',
    icon: TeamOutlined,
    items: [
      { title: 'List', icon: UnorderedListOutlined, route: '/users' },
      { title: 'Invitations', icon: MailOutlined, route: '/invitations' },
    ],
  },
  USERS_LIST: { title: 'Users', icon: TeamOutlined, route: '/users' },
  PROJECTS: { title: 'Projects', icon: DeploymentUnitOutlined, route: '/projects' },
  CLIENTS: { title: 'Clients', icon: SolutionOutlined, route: '/clients' },
  BUDGET: {
    title: 'Budget',
    icon: BankOutlined,
    items: [
      { title: 'Payments', route: '/payments', icon: DollarCircleOutlined },
      { title: 'Expenses', route: '/expenses', icon: WalletOutlined },
    ],
  },
};

const LINKS_MAP = {
  [USER_ROLE.ADMIN]: [LINKS.USERS, LINKS.ACCOUNTS, LINKS.PROJECTS, LINKS.CLIENTS, LINKS.BUDGET],
  [USER_ROLE.MANAGER]: [LINKS.USERS_LIST, LINKS.ACCOUNTS, LINKS.PROJECTS, LINKS.CLIENTS],
};

const Sidebar = ({ collapsed }) => {
  const router = useRouter();
  const [user] = useSelector(signedUserSelector);

  const [openedKey, selectedKey] = useMemo(
    () => {
      let tree = [];
      const rec = (link) => {
        if (link.items) {
          tree.push(link.title);
          return !!link.items.find(rec);
        }
        const res = link.route === router.route;
        if (res) tree.push(link.title);
        return res;
      };
      let arr = [];
      if (user?.roles?.includes(USER_ROLE.ADMIN)) arr = LINKS_MAP[USER_ROLE.ADMIN];
      else if (user?.roles?.includes(USER_ROLE.ADMIN)) arr = LINKS_MAP[USER_ROLE.MANAGER];
      for (let i = 0; i < arr.length; i += 1) {
        if (rec(arr[i])) {
          return [tree.slice(0, tree.length - 1).join('-'), tree.join('-')];
        }
        tree = [];
      }
      return [null, null];
    },
    [router, user],
  );

  const renderMenuItems = useCallback((link, idx, tree = []) => {
    const key = tree.length
      ? `${tree.join('-')}-${link.title}`
      : link.title;

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

  const links = useMemo(() => {
    let array = [];
    if (user?.roles?.includes(USER_ROLE.ADMIN)) array = LINKS_MAP[USER_ROLE.ADMIN];
    else if (user?.roles?.includes(USER_ROLE.ADMIN)) array = LINKS_MAP[USER_ROLE.MANAGER];
    return array.map((item, idx) => renderMenuItems(item, idx));
  }, [renderMenuItems, user]);

  return (
    <AntLayout.Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo} />
      <Menu
        theme='dark'
        mode='inline'
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={[openedKey]}
        selectedKeys={[selectedKey]}
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
