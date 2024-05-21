import React from 'react';
import { MarkdownViewer } from 'lyr-extra';
import uiStore from './store/ui';

export default ({ github, updateTime, ...rest }: any) => {
  const { dark } = uiStore.useSnapshot();
  return (
    <div>
      <MarkdownViewer {...rest} codeTheme={dark ? 'dark' : 'light'} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 120px',
        }}
      >
        <a href={github} target="_blank">
          Edit this doc on GitHub
        </a>
        <span>
          <a>last Update: </a> {new Date(updateTime).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
