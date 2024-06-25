import React, { useRef, useMemo, useState, useEffect } from 'react';
import { MarkdownViewer, encode } from 'lyr-extra';
import MarkdownViewerSource from './markdown-viewer-source';
import MarkdownViewerType from './markdown-viewer-type';
import { Menu, BackTop, Tooltip } from '@arco-design/web-react';
import { IconCaretUp } from '@arco-design/web-react/icon';
import uiStore from './store/ui';

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
                typesAPI={MarkdownViewerType}
                ref={mdRef}
                extraRender={({ tabs, code }: any) => {
                  return (
                    <Tooltip content="打开 Playground ">
                      <svg
                        viewBox="0 0 1024 1024"
                        width="16"
                        height="16"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const dependencies = {};
                          tabs.forEach((key: string) => {
                            dependencies[key] = MarkdownViewerSource[key]
                          })
                          const params = encode(
                            JSON.stringify({
                              dependencies,
                              code,
                            }),
                          );
                          window.open(
                            `${location.pathname}#/~playground?params=${params}`,
                          );
                        }}
                      >
                        <path
                          d="M665.088 131.584L354.304 415.744 220.16 314.368c-11.264-8.704-27.136-8.192-38.4 0.512L133.12 354.304c-14.848 11.776-15.36 34.304-1.536 47.104L250.88 510.464 131.584 619.52c-14.336 12.8-13.312 35.328 1.536 47.104l48.64 39.424c11.264 9.216 27.136 9.216 38.4 0.512l134.144-101.376 310.784 284.672c17.92 16.384 44.032 19.456 65.536 8.192l147.968-79.36c18.432-9.728 30.208-29.184 30.208-50.176V252.928c0-20.992-11.776-40.448-30.208-50.176l-147.968-79.36c-21.504-11.264-47.616-8.192-65.536 8.192z m-185.856 378.88l233.984-177.152v354.816L479.232 510.464z"
                          fill="#8a8a8a"
                        />
                      </svg>
                    </Tooltip>
                  );
                }}
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
