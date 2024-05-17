import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import webpack from 'webpack';
import chalk from 'chalk';
import * as glob from 'glob';
import * as fs from 'fs-extra';

const buildESM = async (rootPath: string) => {
  const { exec } = require('child_process');
  console.log(chalk.cyanBright('start building esm...'));
  return new Promise((res) => {
    exec('tsc -d -p ../', (err, stdout) => {
      if (err) {
        console.log(chalk.bgRed('--- build error ----'));
        console.log(chalk.red(stdout));
      } else {
        const files = glob.sync(`${rootPath}/dist/**/*.[t]s`);
        console.log(chalk.bgCyan('--- build success ----'));
        /** 拷贝模版 */
        files.forEach((i) => console.log(chalk.cyanBright(i)));
        res(true);
      }
    });
  });
};

const buildCjs = async (config: ConfigProps) => {
  console.log(chalk.cyanBright('start building cjs...'));
  const compiler = webpack(
    merge(
      common(config),
      {
        entry: resolve('./', '/src/index.ts'),
      },
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './dist'),
          filename: 'index.js',
        },
      } as any,
    ),
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

/** build 打包 */
export default async (rootPath: string, config: ConfigProps) => {
  // clean
  fs.removeSync('./dist'); 
  // build esm
  await buildESM(rootPath);
  // build cjs
  await buildCjs(config);
};
