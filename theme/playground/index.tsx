import React from 'react';
import { ReactPlayground, getUrlSearchParams, decode } from 'lyr-extra';
import { mdRequire } from '../../.lyr/router';

export default () => {
  const { params }: any = getUrlSearchParams(location.hash);
  const { dependencies, code } = JSON.parse(decode(params));
  return (
    <ReactPlayground
      showLogo
      style={{ width: '100vw', height: '100vh' }}
      require={mdRequire}
      code={code}
      dependencies={dependencies}
    />
  );
};
