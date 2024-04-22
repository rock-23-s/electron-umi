import { useEffect } from 'react'
import { ipcRenderer, isElectron } from '../utils/electron'

const Layout: React.FC = () => {

  useEffect(() => {
    console.log(isElectron ? ipcRenderer.osMachineId : '')
  }, [])
  return <>
    Hello, My Umi Frame
  </>
}

export default Layout