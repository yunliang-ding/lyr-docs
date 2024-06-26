import React from 'react';
import { ReactPlayground, getUrlSearchParams, decode } from 'lyr-extra';
import { mdRequire } from '../../.lyr/router';
import source from '../../.theme/markdown-viewer-source';

export default () => {
  const { params }: any = getUrlSearchParams(location.hash);
  const { tabs, code, previewOnly } = JSON.parse(decode(params));
  const dependencies = {};
  tabs.forEach((key: string) => {
    if (source[key]) {
      dependencies[key] = source[key];
    }
  });
  return (
    <ReactPlayground
      showLogo
      previewOnly={previewOnly}
      style={{ width: '100vw', height: '100vh' }}
      require={mdRequire}
      code={code}
      dependencies={dependencies}
    />
  );
};
