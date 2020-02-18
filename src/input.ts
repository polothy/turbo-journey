import {getInput, InputOptions} from '@actions/core/lib/core'

export function getInputBoolean(name: string, options?: InputOptions): boolean {
  return (getInput(name, options) || 'false').toUpperCase() === 'TRUE'
}
