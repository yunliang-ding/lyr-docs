import React, { useMemo, useState, useEffect } from 'react';
import { MarkdownViewer } from 'lyr-extra';
import MarkdownViewerSource from './markdown-viewer-source';
import uiStore from './store/ui';
import { Menu } from '@arco-design/web-react';

export default ({ github, updateTime, ...rest }: any) => {
  const [, setReload] = useState(Math.random());
  const { dark, collapsed } = uiStore.useSnapshot();
  const defaultSelectedKeys = decodeURIComponent(location.hash.split('#')[2]);
  const navs: string[] = useMemo(() => [], [rest.content, dark, collapsed]);
  useEffect(() => {
    // 等待解析完毕
    setReload(Math.random());
    if (defaultSelectedKeys) {
      setTimeout(() => {
        document.getElementById(defaultSelectedKeys)?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [rest.content, dark, collapsed]);
  return (
    <div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: 'calc(100% - 200px)' }}>
          <MarkdownViewer
            {...rest}
            h2Render={(title: string) => {
              navs.push(title);
            }}
            codeTheme={dark ? 'dark' : 'light'}
            source={MarkdownViewerSource}
          />
        </div>
        <Menu
          defaultSelectedKeys={[defaultSelectedKeys]}
          style={{ width: 200, position: 'fixed', right: 10, top: 100 }}
        >
          {navs.map((nav: string) => {
            return (
              <Menu.Item
                key={nav}
                onClick={() => {
                  document.getElementById(nav)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                {nav}
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 120px',
        }}
      >
        <a href={github} target="_blank">
          在 GitHub 上编辑此页
        </a>
        <span>
          <a>最后更新时间: </a> {new Date(updateTime).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
