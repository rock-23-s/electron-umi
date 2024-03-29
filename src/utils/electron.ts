// eslint-disable-next-line import/prefer-default-export
export const ipcRenderer = window.electron?.ipcRenderer;

export const isElectron = navigator.userAgent.toLowerCase().includes(' electron/');
