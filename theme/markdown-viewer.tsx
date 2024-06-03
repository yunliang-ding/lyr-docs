import React, { useMemo, useState, useEffect } from 'react';
import { MarkdownViewer } from 'lyr-extra';
import MarkdownViewerSource from './markdown-viewer-source';
import uiStore from './store/ui';
import { Menu, BackTop } from '@arco-design/web-react';
import { IconCaretUp } from '@arco-design/web-react/icon';

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
    <div
      id="lyr-docs-backtop"
      style={{
        overflow: 'auto',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: 'calc(100% - 200px)' }}>
          <MarkdownViewer
            {...rest}
            h2Render={(title: string) => {
              navs.push(title);
            }}
            codeTheme={dark ? 'dark' : 'light'}
            source={MarkdownViewerSource}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 60px',
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
        <Menu
          defaultSelectedKeys={[defaultSelectedKeys]}
          className="markdown-viewer-navs"
          style={{
            width: 200,
            position: 'fixed',
            right: 10,
            top: 100,
            borderLeft: '1px solid var(--color-fill-3)',
          }}
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
      <BackTop
        easing="linear"
        duration={500}
        style={{
          position: 'absolute',
          right: 60,
          bottom: 60,
        }}
        visibleHeight={400}
        target={() => document.getElementById('lyr-docs-backtop') as any}
      >
        <div
          className="custom-backtop"
          tabIndex={0}
          role="button"
          aria-label="scroll to top"
        >
          <IconCaretUp />
          <br />
          TOP
        </div>
      </BackTop>
    </div>
  );
};
