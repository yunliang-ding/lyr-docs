# lyr-docs

- 自动解析 `docs` 文件夹下的 `md` 文件生成路由
- md 文件中 `React` 组件渲染能力依赖 `MarkdownViewer`
  - 支持在线运行demo
  - 支持解析组件API
- 舍弃 dumi 多余的特性、仅保留基本的使用习惯
- 采用 rollup 提供组件打包的能力（ems、cjs、umd）
- 代码完全 cover 方便定制化、启动打包速度明显提升2～3秒启动服务

# 为什么不用 dumi

- 1.x 经常页面崩贵 (貌似是 默认主题的 API 解析有问题)
- 样式定制复杂，依赖东西太多，1.x less 必须是 4.x 以下版本
- 1.x 启动速度慢50s左右（不知道做了什么东西）
- 2.x`ui`不喜欢

# 在线文档

[点击跳转文档](http://dev-ops.yunliang.cloud/website/lyr-docs)
