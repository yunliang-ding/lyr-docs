/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { AppLayout, Button } from 'lyr-component';
import uiStore from '../store/ui';
import menus from '@/.lyr/menus';
import navs from '@/.lyr/navs';
import breadcrumbStore from '../store/breadcrumb';
import Footer from './footer';
import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { packageName, favicon, repository } from 'lyr';
import { IconGithub } from '@arco-design/web-react/icon';

export default () => {
  const layoutRef: any = useRef({});
  const breadcrumb = breadcrumbStore.useSnapshot();
  const { dark, compact, collapsed, primaryColor } = uiStore.useSnapshot();
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
        /** 滚动到顶部 */
        document.querySelector('.markdown-viewer')?.scrollIntoView({
          // behavior: "smooth"
        });
      },
    );
    return removeListener;
  }, []);
  return (
    <AppLayout
      layoutRef={layoutRef}
      waterMarkProps={{
        gap: [200, 200],
        content: `${packageName}`,
        zIndex: 10,
        fontStyle: {
          color: dark ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)',
          fontSize: 12,
        },
      }}
      logo={
        <img
          src={favicon}
          style={{
            width: 32,
            height: 32,
          }}
        />
      }
      compact={compact}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      title={
        <h1
          style={{ cursor: 'pointer' }}
          onClick={() => {
            location.hash = '/';
          }}
        >
          {packageName}
        </h1>
      }
      dark={dark}
      menu={{
        items: menus as any,
        onClick: ({ path }: any) => {
          location.hash = path;
        },
      }}
      rightContentProps={{
        extra: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                position: 'relative',
                top: 3,
              }}
            >
              <a
                href={`https://npmmirror.com/package/${packageName}`}
                target="_blank"
              >
                <img
                  alt="npm"
                  src={`https://img.shields.io/npm/dt/${packageName}`}
                />
              </a>
              <a
                href={`https://npmmirror.com/package/${packageName}`}
                target="_blank"
              >
                <img
                  alt="NPM downloads"
                  src={`https://img.shields.io/npm/v/${packageName}.svg`}
                />
              </a>
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {navs.map((item) => {
                return (
                  <Button
                    type="text"
                    key={item.path}
                    onClick={() => {
                      window.open(item.path);
                    }}
                    style={{ color: '#666' }}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </div>
            <div>
              <IconGithub onClick={() => {
                window.open(repository)
              }}/>
            </div>
          </div>
        ),
        droplist: null,
        avatarUrl: favicon,
        themeColor: primaryColor,
        onThemeColorChange: (newColor) => {
          uiStore.primaryColor = newColor;
        },
        onDarkChange: (dark) => {
          uiStore.dark = dark;
        },
        onCompactChange: (compact) => {
          // uiStore.compact = compact;
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
