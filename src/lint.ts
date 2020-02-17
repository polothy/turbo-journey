import {exec} from '@actions/exec'
import {toolName} from './installer'
import {argStringToArray} from '@actions/exec/lib/toolrunner'

export async function lint(argStr: string): Promise<string> {
  let output = ''

  const args = argStringToArray(argStr)
  args.push('--out-format', 'json')

  await exec(toolName, args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })

  return output
}
