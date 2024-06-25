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
                    <>
                      <Tooltip content="打开 Playground ">
                        <svg
                          viewBox="0 0 1024 1024"
                          width="18"
                          height="18"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            const params = encode(
                              JSON.stringify({
                                tabs,
                                code,
                              }),
                            );
                            window.open(
                              `${location.pathname}#/~playground?params=${params}`,
                            );
                          }}
                        >
                          <path
                            d="M692.93164037 195.46982397l-277.93652293 255.5507815L259.66865209 333.94238281 195.47509766 371.30468725l153.10898437 140.69267628-153.10898437 140.69267553 64.19355443 37.47304662 155.32646535-117.07558543 277.93652293 255.44003856 135.59062551-65.85468725V261.32714844z m0 168.075v296.89453175l-197.01298803-148.45253957z"
                            fill="#8a8a8a"
                          />
                        </svg>
                      </Tooltip>
                      <Tooltip content="新窗口预览">
                        <svg
                          viewBox="0 0 1024 1024"
                          width="16"
                          height="16"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            const params = encode(
                              JSON.stringify({
                                code,
                                tabs,
                                previewOnly: true,
                              }),
                            );
                            window.open(
                              `${location.pathname}#/~playground?params=${params}`,
                            );
                          }}
                        >
                          <path
                            d="M810.666667 810.666667H213.333333V213.333333h298.666667V128H213.333333c-47.146667 0-85.333333 38.186667-85.333333 85.333333v597.333334c0 47.146667 38.186667 85.333333 85.333333 85.333333h597.333334c47.146667 0 85.333333-38.186667 85.333333-85.333333V512h-85.333333v298.666667zM597.333333 128v85.333333h152.96L330.88 632.746667l60.373333 60.373333L810.666667 273.706667V426.666667h85.333333V128H597.333333z"
                            fill="#8a8a8a"
                          />
                        </svg>
                      </Tooltip>
                    </>
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
