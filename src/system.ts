import * as os from 'os'

export function getPlatform(): string {
  let plat: string = os.platform()
  if (plat === 'win32') {
    plat = 'windows'
  }

  return plat
}

export function getArch(): string {
  let arch: string = os.arch()

  switch (arch) {
    case 'x64':
      arch = 'amd64'
      break
    case 'x32':
      arch = '386'
      break
  }

  return arch
}
