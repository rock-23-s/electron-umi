import { useEffect } from 'react'
import { ipcRenderer, isElectron } from '../utils/electron'
import { LayoutEnums } from '@/enums/layout'
const Layout: React.FC = () => {
  
  useEffect(() => {
    window.onmessage = (event) => {
      console.log('[renderer] actual event.data =', event);
    
      
      // 只处理预期的 channel 名称
      // if (event.source !== window || event.data !== LayoutEnums.POSTMESSAGE) {
      //   // 可能是别的来源（iframe、devtools 等），忽略
      //   return;
      // }

      // console.log('[renderer] received postMessage from preload, data=', event.data, 'ports=', event.ports);
    
      const port = event.ports && event.ports[0];
      
      if (!port) {
        console.log('[renderer] No port received!');
        return;
      }

      if(event.data === 'window.main') {
        port.postMessage('ready')
      }

      // port.postMessage({from: 'renderder', data: 'I from Layout Component'})
      // 给 port 注册 onmessage
      port.onmessage = (e) => {
        console.log('[renderer] port.onmessage:', e.data);
      };
    }
  }, [])

  const clickHandle = () => {
    ipcRenderer.send(LayoutEnums.TESTMESSAGE)
  }
  return <>
    Hello, My Umi Frame
    <button onClick={clickHandle}>测试</button>
  </>
}

export default Layout