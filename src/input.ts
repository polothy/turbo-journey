import {getInput, InputOptions} from '@actions/core/lib/core'

/**
 * Convert input from string into boolean
 * @param name name of the input to get
 * @param options optional. See InputOptions.
 */
export function getInputBoolean(name: string, options?: InputOptions): boolean {
  return (getInput(name, options) || 'false').toUpperCase() === 'TRUE'
}
