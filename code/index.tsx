import { ReactElement } from 'react';
import ReactDom from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './layouts/index';
import ErrorBoundary from './error-boundary';
import router from './router';
import ConfigProps from './type';
import './global.less';

const App = () => {
  const element = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: router.map((item) => ({
        ...item,
        errorElement: <ErrorBoundary />,
      })),
    },
  ]);
  return <RouterProvider router={element} />;
};

interface AppProps {
  element?: string;
  loading?: () => ReactElement;
}

export const runApp = async ({
  element = '#root',
  loading = () => <span>加载中...</span>,
}: AppProps) => {
  ReactDom.render(loading(), document.querySelector(element));
  ReactDom.render(<App />, document.querySelector(element));
};

export const defineConfig = (props: ConfigProps) => {
  return props;
};