/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef } from 'react';
import { AppLayout } from 'lyr-component';
import { asyncLoadLink } from 'lyr-extra';
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
  const { dark, collapsed, primaryColor } = uiStore.useSnapshot();
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
      layout="inline"
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
      logo={favicon}
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
      onDarkChange={(dark: boolean) => {
        asyncLoadLink(
          `https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/highlight.atom-one-${
            dark ? 'dark' : 'light'
          }.min.css`,
        );
        uiStore.dark = dark;
      }}
      menu={{
        items: menus as any,
        onClick: ({ path }: any) => {
          location.hash = path;
        },
      }}
      themeColor={primaryColor}
      onSetting={(value: any) => {
        if (value.themeColor) {
          uiStore.primaryColor = value.themeColor;
        }
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
      }}
      pageHeaderProps={breadcrumb}
      footerRender={() => null}
      siderFooterRender={() => (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid var(--color-fill-3)',
          }}
        >
          @ design by
          <a
            style={{ marginLeft: 8 }}
            target="_blank"
            href="https://github.com/yunliang-ding/lyr-docs"
          >
            lyr-docs
            <svg
              viewBox="0 0 100 100"
              width="15"
              height="15"
              style={{
                position: 'relative',
                top: 3,
                marginLeft: 4,
              }}
            >
              <path
                fill="currentColor"
                d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
              ></path>
              <polygon
                fill="currentColor"
                points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
              ></polygon>
            </svg>
          </a>
        </div>
      )}
    >
      <Outlet />
    </AppLayout>
  );
};
