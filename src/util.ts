import * as os from 'os'

export function print(m: string): void {
  process.stdout.write(m + os.EOL)
}
