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
    '666'
  ]
  args.push(...argStringToArray(argStr))

  const code = await exec(toolName, args, {
    ignoreReturnCode: true,
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })

  if (code !== 0 && code !== 666) {
    throw new Error(`${toolName} failed to run with exit code ${code}`)
  }

  return output
}
