/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef } from 'react';
import { AppLayout } from 'lyr-component';
import uiStore from '../store/ui';
import menus from '@/.lyr/menus';
import navs from '@/.lyr/navs';
import breadcrumbStore from '../store/breadcrumb';
import { Outlet } from 'react-router-dom';
import { packageName, favicon, repository } from 'lyr';
import { IconGithub } from '@arco-design/web-react/icon';
import { Menu } from '@arco-design/web-react';

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
          behavior: 'smooth',
        });
      },
    );
    return removeListener;
  }, []);
  return (
    <AppLayout
      layoutRef={layoutRef}
      className="lyr-docs-wrap"
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
              className="package-version"
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
            <div>
              <IconGithub
                onClick={() => {
                  window.open(repository);
                }}
              />
            </div>
          </div>
        ),
        droplist:
          navs.length > 0 ? (
            <Menu>
              {navs.map((item) => {
                return (
                  <Menu.Item
                    key={item.title}
                    onClick={() => {
                      window.open(item.path);
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{item.title}</h4>
                  </Menu.Item>
                );
              })}
            </Menu>
          ) : null,
        avatarUrl: favicon,
        themeColor: primaryColor,
        onThemeColorChange: (newColor) => {
          uiStore.primaryColor = newColor;
        },
        onDarkChange: (dark) => {
          uiStore.dark = dark;
        },
      }}
      pageHeaderProps={breadcrumb}
      footerRender={() => null}
      siderFooterRender={() => null}
    >
      <Outlet />
    </AppLayout>
  );
};
