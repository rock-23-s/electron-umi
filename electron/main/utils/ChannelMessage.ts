import { LayoutEnums } from '../../../src/enums/layout';
import { ipcMain, MessageChannelMain } from 'electron'
/**
 * 用于 MessageChannelMain 通信 学习
 */
export class ChannelMessage {
  
  content: Electron.WebContents;
  port: Electron.MessagePortMain | null;

  constructor(content: Electron.WebContents) {
    this.content = content;
    this.port = null;

    this.content.on('did-finish-load', () => {
      // 创建消息通道
      const { port1, port2 } = new MessageChannelMain();
      this.port = port1;
      
      this.initPortMessage();

      setTimeout(() => {
        this.content.postMessage(LayoutEnums.POSTMESSAGE, { hello: 'world' }, [port2])
      }, 500)
    });

    ipcMain.on(LayoutEnums.TESTMESSAGE, () => {
      this.sendToRender({from: 'main', data: { name: 'marco', age: 43 }})
    })
  }

  initPortMessage () {
    if(!this.port) return;

    this.port.postMessage({ from: 'main', test: 123 })

    this.port.on('message', (event) => {
      console.log(event.data)
      if (event.data === 'ready') {
        this.port?.postMessage({ from: 'main', test: 123, echo: event.data });
      }
    });

    this.port.start();
  }

  sendToRender(data: any) {
    if(!this.port) return;
    this.port.postMessage(data)
  }
}
