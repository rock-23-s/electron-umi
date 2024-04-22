const machineId = require('node-machine-id');

export const isMac = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';
export const isWindows = process.platform === 'win32';

/** 获取设备版本号 */
export const osVersion = process.version
/** 获取设备id */
export const osMachineId = machineId.machineIdSync();
/** 获取os */
export const os = process.platform