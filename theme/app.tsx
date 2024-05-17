import { runApp } from './index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  minimum: 0.3,
  easing: 'ease-in-out',
});

runApp({
  /** 节点 */
  element: '#root',
});
