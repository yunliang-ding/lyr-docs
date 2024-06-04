import React, { useRef, useMemo, useState, useEffect } from 'react';
import { MarkdownViewer } from 'lyr-extra';
import MarkdownViewerSource from './markdown-viewer-source';
import uiStore from './store/ui';
import { Menu, BackTop } from '@arco-design/web-react';
import { IconCaretUp } from '@arco-design/web-react/icon';
export default ({ github, updateTime, ...rest }: any) => {
  const [, setReload] = useState(Math.random());
  const mdRef: any = useRef({});
  const { dark } = uiStore.useSnapshot();
  useEffect(() => {
    mdRef.current.setTheme?.(dark ? 'dark' : 'light');
  }, [dark]);
  const defaultSelectedKeys = decodeURIComponent(location.hash.split('#')[2]);
  useEffect(() => {
    if (defaultSelectedKeys) {
      setTimeout(() => {
        document.getElementById(defaultSelectedKeys)?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  }, []);
  // 等待 md 解析完毕拿到导航信息再重新render一次
  useEffect(() => {
    setTimeout(() => {
      setReload(Math.random());
    }, 300);
  }, [rest.content]);
  return (
    <div
      id="lyr-docs-backtop"
      style={{
        overflow: 'auto',
        height: '100%',
        backgroundColor: 'var(--color-menu-light-bg)',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: 'calc(100% - 200px)' }}>
          {useMemo(
            () => (
              <MarkdownViewer
                {...rest}
                codeTheme={dark ? 'dark' : 'light'}
                source={MarkdownViewerSource}
                ref={mdRef}
              />
            ),
            [rest.content],
          )}
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
        <div className="markdown-viewer-navs">
          <Menu
            defaultSelectedKeys={[defaultSelectedKeys]}
            style={{ borderLeft: '1px solid var(--color-fill-3)' }}
          >
            {mdRef.current.getNavs?.()?.map((nav: string) => {
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
