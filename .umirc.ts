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
  // 客户端打包改成 ./ ，网页端打包用 
  base: process.env.NODE_ENV === 'production' ? "./" : '/',
  // 客户端打包改成 ./ ，网页端打包用
  publicPath: process.env.NODE_ENV === 'production' ? "./" : '/',
  history: { type: 'hash' },
  // 打包输出路径
  outputPath: 'release/app/dist/renderer',
});

