import { defineConfig } from '@umijs/max';
import routes from './src/route'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  layout: {
    title: '@umijs/max',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  routes,
  npmClient: 'yarn',
  hash: true,
  base: './',
  publicPath: "./",
  history: { type: 'hash' },
  // 打包输出路径
  outputPath: 'release/app/dist/renderer',
});

