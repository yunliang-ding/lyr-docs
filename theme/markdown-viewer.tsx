import React from 'react';
import { MarkdownViewer } from 'lyr-extra';
import MarkdownViewerSource from './markdown-viewer-source';
import uiStore from './store/ui';

export default ({ github, updateTime, ...rest }: any) => {
  const { dark } = uiStore.useSnapshot();
  return (
    <div>
      <MarkdownViewer
        {...rest}
        codeTheme={dark ? 'dark' : 'light'}
        source={MarkdownViewerSource}
      />
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
