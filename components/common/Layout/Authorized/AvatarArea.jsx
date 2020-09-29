import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Avatar, Dropdown, Menu, message,
} from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styles from '../Layout.module.scss';
import { accountSelector } from '../../../../store/auth/selectors';
import { logout as logoutAction } from '../../../../store/auth/actions';

const ITEMS = [
  { icon: UserOutlined, title: 'Profile', route: '/profile' },
  { divider: true },
  { icon: LogoutOutlined, title: 'Logout', logout: true },
];

const AvatarArea = () => {
  const dispatch = useDispatch();
  const [user] = useSelector(accountSelector);
  const router = useRouter();

  const logout = useCallback(async () => {
    const { error } = await dispatch(logoutAction());
    if (error) {
      message.error('Unable to log out');
    } else {
      await router.replace('/login');
    }
  }, [router, dispatch]);

  const menu = useMemo(() => (
    <Menu>
      {
        ITEMS.map((item, idx) => {
          if (item.logout) {
            return (
              <Menu.Item key={idx.toString()} onClick={logout} icon={<item.icon />}>{ item.title }</Menu.Item>
            );
          }
          if (item.divider) return <Menu.Divider key={idx.toString()} />;
          return (
            <Menu.Item key={idx.toString()} icon={<item.icon />}>
              <Link href={item.route}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{ item.title }</a>
              </Link>
            </Menu.Item>
          );
        })
      }
    </Menu>
  ), [logout]);

  return (
    <Dropdown overlay={menu}>
      <div className={styles.avatarWrap}>
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        <span>{ user?.name }</span>
      </div>
    </Dropdown>
  );
};

export default AvatarArea;
