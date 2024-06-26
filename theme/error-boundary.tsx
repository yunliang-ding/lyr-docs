/* eslint-disable no-console */
import { Result } from '@arco-design/web-react';
import { useRouteError } from 'react-router-dom';

export default () => {
  const error = useRouteError();
  return (
    <Result
      status="warning"
      title={
        <div>
          <h1>很抱歉，页面出现了一些问题</h1>
          <span style={{ color: 'red' }}>{String(error)}</span>
        </div>
      }
    />
  );
};
