import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as chokidar from 'chokidar';
import chalk from 'chalk';
import { resolve } from 'path';
import { ConfigProps } from './type';
import { withCustomConfig } from 'react-docgen-typescript';

const getIndexHtml = ({
  favicon,
  title,
  script,
  link,
  liveReload,
}) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${favicon}" />
  <meta name="viewport" content="width=device-width, initial-scale=0.2" />
  <title>${title}</title>
  ${liveReload}
  ${link}
</head>

<body>
  <div id="root" />
</body>
${script}
</html>`;

const encodeStr = (str) => `#_#${str}#_#`;
const decodeStr = (str) => str.replaceAll('"#_#', '').replaceAll('#_#"', '');
/** 创建文件路由 */
const createFileRouter = async function (
  rootPath = '',
  config: ConfigProps = {},
  sleep = true,
) {
  const packageJson = require(`${rootPath}/package.json`);
  const libName = packageJson.name.replaceAll('-', '');
  const folder = `${rootPath}/docs/**/*.md`;
  const files = glob.sync(folder);
  const _require = {};
  const importArr = [
    `import React from 'react';`,
    `import MarkdownViewer from '../../.theme/markdown-viewer';`,
  ];
  // 开启仅站点模式
  if (config.docsMode !== true) {
    importArr.push(`import * as ${libName} from '../index';`);
    _require[packageJson.name] = encodeStr(libName);
  }
  const docsRequire = config.docsRequire || {};
  Object.keys(docsRequire).forEach((key) => {
    importArr.push(`import * as ${key} from "${docsRequire[key]}"`);
    _require[docsRequire[key]] = encodeStr(key);
  });
  const extraRequire = glob.sync(`${rootPath}/docs/**/*.ts{,x}`);
  extraRequire.forEach((item) => {
    const packageName = item.replace(rootPath, '../..');
    const pathName = packageName.replace('../../docs', '@');
    const name = pathName
      .replaceAll('@', '__')
      .replaceAll('/', '0_0')
      .replaceAll('.', '1_1')
      .replaceAll('-', '2_2');
    importArr.push(`import ${name} from "${packageName}"`);
    _require[pathName] = encodeStr(name);
  });
  const requireString = decodeStr(JSON.stringify(_require));
  const routes = files.map((file) => {
    let filePath: any = file.split('/docs')[1];
    let CompName: string[] = [];
    let path = '';
    filePath = filePath.substring(0, filePath.lastIndexOf('.'));
    const originPath = filePath;
    if (filePath === '/index') {
      filePath = '/index';
      path = '/';
      CompName = ['R'];
    } else {
      if (filePath.endsWith('/index')) {
        filePath = filePath.substring(0, filePath.length - 6); // 移除 index
      }
      path = filePath;
      CompName = `${filePath
        .replaceAll('/', '')
        .replaceAll('$', '')
        .replaceAll('-', '')
        .replaceAll('.', '')
        .replaceAll(' ', '')}`.split('');
      // 字母开头
      if (/[a-zA-Z]/.test(CompName[0])) {
        CompName[0] = CompName[0].toUpperCase();
      } else {
        CompName.unshift('R');
      }
    }
    // 添加依赖
    importArr.push(
      `import ${CompName.join('')} from '../../docs${originPath}.md';`,
    );
    return {
      path,
      component: encodeStr(
        `<MarkdownViewer github='${
          packageJson.repository?.url
        }/tree/main${file.replace(rootPath, '')}' updateTime='${
          fs.statSync(file).mtime
        }' content={${CompName.join('')}} require={mdRequire} />`,
      ),
    };
  });
  const routerConfig = `export default ${decodeStr(
    JSON.stringify(routes, null, 2),
  )}`;
  const content = `${importArr.join(
    '\n',
  )}\n\nconst mdRequire = ${requireString.replaceAll(
    '"',
    "'",
  )}\n\n${routerConfig};\n`;
  const outputFilePath = resolve(`${rootPath}/src/.lyr/router.tsx`);
  // 为了处理文件重命名的问题，采用了先删除 -> 延迟 -> 创建的兜底方案
  fs.removeSync(outputFilePath);
  if (sleep) {
    await new Promise((res) => setTimeout(res, 300));
  }
  fs.outputFile(outputFilePath, content);
};
/** 创建docs代码的依赖文件 */
const createRequireSocure = async function (rootPath: string) {
  const extraRequire = glob.sync(`${rootPath}/docs/**/*.ts{,x}`);
  const golbalFiles = {};
  extraRequire.forEach((item) => {
    const packageName = item.replace(rootPath, '../..');
    const pathName = packageName.replace('../../docs', '@');
    golbalFiles[pathName] = fs.readFileSync(item).toString();
  });
  /** 创建菜单 */
  fs.outputFileSync(
    `${rootPath}/.theme/markdown-viewer-source.ts`,
    `export default ${JSON.stringify(golbalFiles || [], null, 2)}`,
  );
};
/** 创建组件 interface 描述对象 */
const createComponentTypeMapping = (rootPath: string) => {
  const componentInterface = {};
  const types = glob.sync([
    `${rootPath}/src/**/*.type.tsx`,
    `${rootPath}/src/**/type.tsx`,
  ]);
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  const parser = withCustomConfig(tsconfigPath, {
    savePropValueAsString: true,
    skipChildrenPropWithoutDoc: true,
  });
  parser.parse(types).forEach((item: any) => {
    const filePath = item.filePath.split(rootPath)[1];
    componentInterface[filePath] = [];
    Object.keys(item.props).forEach((key) => {
      const p = item.props[key];
      if (p.description !== '') {
        componentInterface[filePath].push({
          name: p.name,
          required: p.required,
          type: p.type?.name,
          defaultValue: p.defaultValue,
          description: p.description,
        });
      }
    });
  });
  fs.outputFileSync(
    `${rootPath}/src/.lyr/type-mapping.ts`,
    `export default ${JSON.stringify(componentInterface, null, 2)}`,
  );
};
/** 创建 .lyr */
export const createLyr = function (rootPath = '', config: ConfigProps) {
  const packageJson = require(`${rootPath}/package.json`);
  /** 同步主题 */
  fs.copySync(path.resolve(__dirname, '../theme'), `${rootPath}/.theme`);
  console.log(chalk.green('=> create .theme done.'));
  /** 创建菜单 */
  fs.outputFileSync(
    `${rootPath}/src/.lyr/menus.ts`,
    `export default ${JSON.stringify(config.menus || [], null, 2)}`,
  );
  /** 创建导航 */
  fs.outputFileSync(
    `${rootPath}/src/.lyr/navs.ts`,
    `export default ${JSON.stringify(config.navs || [], null, 2)}`,
  );
  /** 创建index */
  fs.outputFileSync(
    `${rootPath}/src/.lyr/index.ts`,
    `import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface ConfigProps {
  title?: string;
  favicon?: string;
  devScript?: string[];
  buildScript?: string[];
  link?: string[];
  bundleAnalyzer?: BundleAnalyzerPlugin.Options;
  webpackConfig?: (
    mode: 'development' | 'production' | undefined,
  ) => Configuration;
  serverPath?: string;
  navs?: {
    title: string;
    path: string;
  }[],
  menus?: {
    label: string;
    path: string;
    icon?: any,
    children?: any[]
  }[];
  docsRequire?: {
    [key: string]: string
  },
  docsMode?: boolean;
};

export const defineConfig = (props: ConfigProps) => {};

export const packageName = "${packageJson.name}";

export const favicon = "${config.favicon}";

export const repository = "${packageJson.repository?.url}";


`,
  );
  /** 创建依赖描述 */
  createRequireSocure(rootPath);
  /** 创建组件 interface 描述对象  */
  createComponentTypeMapping(rootPath);
  /** 监听 type 文件改动 */
  const watcherType = chokidar.watch(
    [`${rootPath}/src/**/*.type.tsx`, `${rootPath}/src/**/type.tsx`],
    {
      ignored: /node_modules/,
      ignoreInitial: true,
    },
  );
  watcherType.on('change', async () => {
    createComponentTypeMapping(rootPath);
  });
  watcherType.on('add', async () => {
    createComponentTypeMapping(rootPath);
  });
  /** 创建路由 */
  createFileRouter(rootPath, config, false);
  /** 监听路由改动 */
  const watcher = chokidar.watch(`${rootPath}/docs/**/*.md`, {
    ignored: /node_modules/,
    ignoreInitial: true,
  });
  watcher.on('add', async () => {
    createFileRouter(rootPath, config);
  });
  watcher.on('unlink', async () => {
    createFileRouter(rootPath, config);
  });
  console.log(chalk.green('=> create .lyr done.'));
};
/** 创建index.html */
export const createIndexHtml = async function (
  rootPath = '',
  config: ConfigProps,
) {
  const mode = config.mode === 'development' ? 'dev' : 'build';
  const cdn = mode === 'dev' ? config.devScript : config.buildScript;
  const script = [...(cdn || []), `/${mode}/index.js`];
  const link = [...(config.link || []), `/${mode}/index.css`];
  // 开启 liveReload
  let liveReload = '';
  if (mode === 'dev') {
    liveReload = `<script>
    // 由 lyr-docs 在开发环境所创建
    window.__lyrcli_version__ = "${config.version}";
    window.onload = () => {
      if ('WebSocket' in window) {
        let ws = new WebSocket(\`ws://$\{location.hostname\}:${config.wsPort}/websocket\`);
        ws.onmessage = (message) => {
          if (message.data === "1") {
            location.reload();
          } else {
            const iframe = document.createElement('iframe');
            iframe.id = "lyr-docs-client-overlay"
            iframe.style = "padding: 20px;background: #222;opacity: .9;position: fixed; inset: 0px; width: 100vw; height: 100vh; border: none; z-index: 2147483647;"
            document.body.appendChild(iframe);
            document.querySelector("#lyr-docs-client-overlay").contentWindow.document.body.innerHTML = \`
                    <div style="font-size: 20px;color: red;margin-bottom: 20px;">编译异常</div>
                    <div id="close" style="cursor: pointer; position: fixed; top: 0; right: 40px;"><svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M512 421.490332 331.092592 240.582924C306.351217 215.841549 265.464551 215.477441 240.470996 240.470996 215.303191 265.638801 215.527553 306.037221 240.582924 331.092592L421.490332 512 240.582925 692.907407C215.84155 717.648782 215.477441 758.535449 240.470996 783.529004 265.638801 808.696809 306.037222 808.472446 331.092593 783.417075L512 602.509668 692.907407 783.417075C717.648782 808.15845 758.535449 808.522559 783.529004 783.529004 808.696809 758.361199 808.472446 717.962778 783.417075 692.907407L602.509668 512 783.417076 331.092592C808.158451 306.351217 808.522559 265.464551 783.529004 240.470996 758.361199 215.303191 717.962779 215.527553 692.907408 240.582924L512 421.490332Z" fill="#fff"></path></svg></div>
                    <pre style="color: red; margin: 10px 0">$\{message.data\}</pre>
                  \`;
            document.querySelector("#lyr-docs-client-overlay").contentWindow.document.querySelector("#close").addEventListener('click', () => {
              document.querySelector("#lyr-docs-client-overlay").remove()
            })
          }
        };
      }
    };
</script>`;
  }
  const content = getIndexHtml({
    favicon: config.favicon,
    title: config.title,
    link: link
      .map((i) => `<link rel="stylesheet" type="text/css" href="${i}" />`)
      .join('\n'),
    script: script
      .map((i) => `<script crossorigin src="${i}"></script>`)
      .join('\n'),
    liveReload,
  });
  fs.outputFile(`${rootPath}/www/${mode}/index.html`, content);
  console.log(chalk.green('=> create index.html done.'));
};
