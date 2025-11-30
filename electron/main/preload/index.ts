import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import { isLinux, isMac, isWindows, osMachineId, osVersion, os } from '../utils/os';
import { LayoutEnums } from '../../../src/enums/layout'

const windowLoaded = new Promise(resolve => {
  window.onload = resolve
})

// 监听来自主进程的 webContents.postMessage
ipcRenderer.on(LayoutEnums.POSTMESSAGE, async (event: any) => {
  console.log('[preload] got main-message, forwarding port to window.main world', event.data, 'ports:', event.ports);
  await windowLoaded;

  // 把 port 转发给页面主世界
  // 注意 event.ports 是一个可传递的 MessagePortMain 实例数组
  window.postMessage(LayoutEnums.POSTMESSAGE, '*', event.ports);
});

const electronHandler = {
  ipcRenderer: {
    /**
     * 异步发送
     * @param channel
     * @param args
     */
    send(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },

    /**
     * 同步发送
     * @param channel
     * @param args
     */
    sendSync(channel: string, ...args: unknown[]) {
      return ipcRenderer.sendSync(channel, ...args);
    },

    /**
     * 渲染进程，调用主进程，并返回数据
     * @param channel
     * @param args
     */
    invoke(channel: string, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },

    /**
     * 监听主进程事件，需要手动取消订阅
     * @param channel
     * @param func
     */
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    /**
     * 监听主进程事件，一次性
     * @param channel
     * @param func
     */
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    isLinux,
    isMac,
    isWindows,
    osMachineId,
    osVersion,
    os
  },
};

/**
 * 将API注入到window，实现渲染进程和主进程的通讯
 */
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
