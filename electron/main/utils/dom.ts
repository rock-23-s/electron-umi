/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import log from 'electron-log';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 8000;
    const url = new URL(`http://localhost:${port}`);
    console.log(url, url.pathname, ' ------------- ')
    url.pathname = htmlFileName;
    return url.href;
  }
  const filePath = `file://${path.resolve(__dirname, '../renderer/', 'index.html')}${htmlFileName}`;
  console.log('load html path', filePath)
  return filePath
}
