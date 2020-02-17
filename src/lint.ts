import {exec} from '@actions/exec'
import {toolName} from './installer'
import {argStringToArray} from '@actions/exec/lib/toolrunner'

export async function lint(argStr: string): Promise<string> {
  let output = ''

  const args: string[] = [
    'run',
    '--out-format',
    'json',
    '--issues-exit-code',
    '0'
  ]
  args.push(...argStringToArray(argStr))

  await exec(toolName, args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })

  return output
}
