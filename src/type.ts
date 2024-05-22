import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface ConfigProps {
  /** 标题 */
  title?: string;
  /** icon */
  favicon?: string;
  /** 开发环境 script */
  devScript?: string[];
  /** 生产环境 script */
  buildScript?: string[];
  /** css */
  link?: string[];
  /** 忽略路由配置 */
  ignoreRouter?: string[];
  /** 是否开启资源包分析 */
  bundleAnalyzer?: BundleAnalyzerPlugin.Options;
  /** webpack 配置 */
  webpackConfig?: (
    mode: 'development' | 'production' | undefined,
  ) => Configuration;
  /** 服务端入口，默认 ./src/apis */
  serverPath?: string;
  /** 导航 */
  navs?: {
    title: string;
    path: string
  }[],
  menus?: {
    label: string;
    path: string;
    icon?: any,
    children?: any[]
  }[];
  /** 代码需要的依赖 */
  docsRequire?: {
    [key: string]: string
  },
  /** 文档站点 */
  docsMode?: boolean;
  mode?: 'development' | 'production';
  wsPort?: number;
  wsHost?: string;
  version?: string;
}
