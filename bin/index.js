#!/usr/bin/env node
const Application = require('thinkjs');
const watcher = require('think-watcher');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  runWatch,
  runBuild,
  getUserConfig,
} = require('../dist/index');
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = getUserConfig().default;
const rootPath = process.cwd();
const APP_PATH = `${rootPath}/${lyrConfig.serverPath || 'src/apis'}`;
lyrConfig.version = version;
const type = process.argv.pop();
// 在这里启动 thinkjs 服务
if (type !== 'build' && type !== 'docs:build') {
  console.log(chalk.green(`=> watch by thinkjs.`));
  const appServer = new Application({
    ROOT_PATH: rootPath,
    APP_PATH,
    env: 'development',
  });
  new watcher(
    {
      srcPath: APP_PATH,
    },
    (fileInfo) => {
      appServer._watcherCallBack(fileInfo);
    },
  ).watch();
  appServer.run(); // 启动 node 服务
}
/** 运行 */
(async () => {
  if (type === 'dev') {
    console.log(chalk.green(`=> use lyr-docs ${version}`));
    lyrConfig.mode = 'development';
    lyrConfig.wsPort = await WebpackDevServer.getFreePort(); // 可用的 wsPort
    runWatch(rootPath, lyrConfig);
  } else if (type === 'build') {
    console.log(chalk.green(`=> use lyr-docs ${version}`));
    lyrConfig.mode = 'production';
    runBuild(rootPath, lyrConfig); // 打包
  } else if (type === 'docs:build') {
    console.log(chalk.green(`=> use lyr-docs ${version}`));
  }
})();
