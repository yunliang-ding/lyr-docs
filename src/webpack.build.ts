import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import { writeFileSync, readFileSync } from 'fs-extra';
import webpack from 'webpack';
import chalk from 'chalk';
import { createLyr, createIndexHtml } from '.';

/** build 打包 */
export default (rootPath: string, config: ConfigProps) => {
  createLyr(rootPath, config); // 创建 src/.lyr
  createIndexHtml(rootPath, config); // 创建 index.html
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './www/build'),
          filename: 'index.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals include '),
    chalk.gray(JSON.stringify(compiler.options.externals, null, 2)),
  );
  compiler.run((err, stats: any) => {
    if (!err && !stats?.hasErrors()) {
      // 构建成功，手动结束进程
      console.log(chalk.green('👏 👏 👏 打包完成...'));
      Object.keys(stats.compilation.assets).forEach((key) => {
        if (key === 'index.js' || key === 'index.css') {
          console.log(
            chalk.gray(
              `${key}: ${Number(
                stats.compilation.assets[key].size() / 1024,
              ).toFixed(1)} kb`,
            ),
          );
        }
        // 插入加载脚本
        if (key === 'index.js') {
          const filePath = resolve('./', './www/build/index.js');
          const content = readFileSync(filePath);
          const newContent = `(async function(link,script){await Promise.all(link.map((href)=>{return new Promise((resolve,reject)=>{const link=document.createElement('link');link.type='text/css';link.rel='stylesheet';link.href=href;document.head.appendChild(link);link.onload=()=>{resolve(true)};link.onerror=(err)=>{reject(err)}})}));const asyncLoadScript=(src)=>{return new Promise((resolve,reject)=>{const script=document.createElement('script');script.type='text/javascript';script.src=src;script.crossOrigin='';document.body.appendChild(script);script.onload=()=>{resolve(true)};script.onerror=(err)=>{reject(err)}})};for(let i=0;i<script.length;i++){await asyncLoadScript(script[i])};${content.toString()}})(${JSON.stringify(config.link)},${JSON.stringify(config.buildScript)})`;
          writeFileSync(resolve('./', './www/build/index.js'), newContent);
        }
      });
      process.exit(0); // 退出
    } else {
      // 构建失败，输出错误信息
      console.log(err, chalk.red(String(stats?.compilation.errors)));
      // 以非零状态码结束进程
      process.exit(1);
    }
  });
};
