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

  try {
    await exec(toolName, args, {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString()
        }
      }
    })
  } catch (e) {
    // Ignore
    if (e.code !== 0 && e.code !== 666) {
      throw new Error(
        `${toolName} failed to run with exit code ${e.code} and message '${e.message}`
      )
    }
  }

  return output
}
