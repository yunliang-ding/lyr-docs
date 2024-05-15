/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { AppLayout } from 'lyr-component';
import { Menu } from '@arco-design/web-react';
import uiStore from '@/store/ui';
import userStore from '@/store/user';
import breadcrumbStore from '@/store/breadcrumb';
import Footer from './footer';
import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';

export default () => {
  const layoutRef: any = useRef({});
  const breadcrumb = breadcrumbStore.useSnapshot();
  const { dark, title, compact, collapsed, primaryColor } =
    uiStore.useSnapshot();
  const { name, avatarUrl, menus } = userStore.useSnapshot();
  const setCollapsed = (v: boolean) => {
    uiStore.collapsed = v;
  };
  // 使用 AppLayout 内置的 监听 hash 方法
  useEffect(() => {
    const removeListener = layoutRef.current.listenHashChange(
      ({ currentBreadcrumb }) => {
        /** 设置当前路由的默认面包屑 */
        breadcrumbStore.title = currentBreadcrumb.title;
        breadcrumbStore.breadcrumb = currentBreadcrumb.breadcrumb;
      },
    );
    return removeListener;
  }, []);
  return (
    <AppLayout
      layoutRef={layoutRef}
      waterMarkProps={{
        gap: [200, 200],
        content: `welcome-${name}`,
        zIndex: 10,
        fontStyle: {
          color: dark ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)',
          fontSize: 12,
        },
      }}
      compact={compact}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      title={title}
      dark={dark}
      menu={{
        items: menus,
        onClick: ({ path }: any) => {
          location.hash = path;
        },
      }}
      rightContentProps={{
        userName: name,
        extra: (
          <p
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              right: 220,
              gap: 14,
              top: 6,
            }}
          >
            <a href="https://npmmirror.com/package/xx-xxx">
              <img alt="npm" src="https://img.shields.io/npm/dt/lyr-cli" />
            </a>
            <a href="https://npmmirror.com/package/xx-xxx">
              <img
                alt="NPM downloads"
                src="https://img.shields.io/npm/v/lyr-cli.svg"
              />
            </a>
          </p>
        ),
        droplist: (
          <Menu>
            <Menu.Item key="logout">切换用户</Menu.Item>
          </Menu>
        ),
        avatarUrl,
        themeColor: primaryColor,
        onThemeColorChange: (newColor) => {
          uiStore.primaryColor = newColor;
        },
        onDarkChange: (dark) => {
          uiStore.dark = dark;
        },
        onCompactChange: (compact) => {
          uiStore.compact = compact;
        },
      }}
      pageHeaderProps={breadcrumb}
      footerRender={() => <Footer />}
      siderFooterRender={() => null}
    >
      <Outlet />
    </AppLayout>
  );
};
